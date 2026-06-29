import { Injectable } from '@nestjs/common';
import { errorMessage } from '../../../shared/constants';
import { User } from '../../../app/user/domain/core/entities/user';
import { AssignRolesToUserDto } from './dtos/assign-roles-to-user';
import { UpdateUserResourcesDto } from './dtos/update-user-resources';
import { UserAssociationDetail } from './dtos/user-association-detail';
import { SelfPrivileges, UserPrivileges } from './dtos/user-privileges';
import { RoleInfo } from '../../../app/authorization/domain/dtos/role-info';
import { UserPrivilegesService } from './abstractions/user-privileges-service';
import { UserService } from '../../../app/user/domain/abstractions/user-service';
import { RoleService } from '../../authorization/domain/abstractions/role-service';
import { Resource } from '../../../app/authorization/domain/core/entities/resource';
import { hasPermissionToManagePermissions } from '../../../shared/utils/permission';
import { validateAssociatedResource } from '../../../shared/utils/associated-resource';
import { ResourceService } from '../../authorization/domain/abstractions/resource-service';
import {
  BadRequestException,
  RoleCode,
  ServiceOption,
  extractAuthUserId,
} from '@mr-bio/core/shared';
import {
  AssociatedResource,
  MergedAssociatedResource,
  MergedAssociatedResourcePermission,
} from '../../../shared/types/associated-resource';
import {
  rolesResourceUnion,
  grantableEntityUnion,
  filterGrantedGrantableEntites,
  grantableEntityDifference,
} from '../../../shared/utils/grantable-entity';

@Injectable()
export class UserPrivilegesServiceImpl implements UserPrivilegesService {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private resourceService: ResourceService
  ) {}

  async assignRolesToUser(
    userId: string,
    assignDto: AssignRolesToUserDto,
    option: ServiceOption
  ): Promise<User> {
    const user = await this.userService.getOneById(userId, option);

    // check if the roles exist. TODO: Do it in single db query
    for (const role of assignDto.roles) {
      await this.roleService.getOneByCode(role, option);
    }

    if (!user.association) {
      user.association = { roles: [...assignDto.roles] };
    } else {
      user.association.roles = [...assignDto.roles];
    }

    return (await this.userService.update(user, option))!;
  }

  async updateUserResources(
    userId: string,
    updateDto: UpdateUserResourcesDto,
    option: ServiceOption
  ): Promise<AssociatedResource[]> {
    await this._validateRequestToUpdateUserResources(updateDto, option);

    const userAssociationDetail = await this.userService.getUserAssociationDetail(userId, option);
    const user = await this.userService.getOneById(userId, option);

    const oldUserResources = userAssociationDetail.resources ?? []; // oldPermissions
    const oldUserPrivileges = await this._resolveUserResources(userAssociationDetail, option); // oldPayload
    const newUserPrivileges = updateDto.resources; // newPayload

    const difference = grantableEntityDifference(
      newUserPrivileges,
      oldUserPrivileges
    ) as AssociatedResource[]; // newPayload - oldPayload
    const union = grantableEntityUnion(difference, oldUserResources) as AssociatedResource[]; // difference U oldPermissions

    if (!user.association) {
      user.association = { resources: union };
    } else {
      user.association.resources = union;
    }

    await this.userService.update(user, option);

    return union;
  }

  async getSelfPrivileges(option: ServiceOption): Promise<SelfPrivileges> {
    const grantedUserPrivileges = await this.getUserGrantedPrivileges(
      extractAuthUserId(option),
      option
    );

    const systemResources = await this.resourceService.get({ limit: 10000 }); // TODO: Handle the limit

    const grantedSelfPrivileges: SelfPrivileges = this._buildSelfPrivileges(
      grantedUserPrivileges,
      systemResources.rows
    );

    return grantedSelfPrivileges;
  }

  async getUserPrivileges(userId: string, option: ServiceOption): Promise<UserPrivileges> {
    const userAssociationDetail = await this.userService.getUserAssociationDetail(userId, option);

    const roles: RoleInfo[] =
      userAssociationDetail.roles?.map(role => ({
        code: role.code,
        name: role.name,
      })) ?? [];

    const resources = await this._resolveUserResources(userAssociationDetail, option);

    return { roles, resources };
  }

  async getUserGrantedPrivileges(userId: string, option: ServiceOption): Promise<UserPrivileges> {
    const userPrivileges = await this.getUserPrivileges(userId, option);

    userPrivileges.resources = filterGrantedGrantableEntites(
      userPrivileges.resources
    ) as AssociatedResource[];

    return userPrivileges;
  }

  private async _resolveUserResources(
    userAssociationDetail: UserAssociationDetail,
    option?: ServiceOption
  ): Promise<AssociatedResource[]> {
    // return all resources for super admin
    const isSuperAdmin = !!userAssociationDetail.roles?.find(
      role => role.code === RoleCode.SUPER_ADMIN
    );
    if (isSuperAdmin) {
      return await this.resourceService.getSuperAdminResources(option);
    }

    const unionOfRoleResources = rolesResourceUnion(userAssociationDetail.roles ?? []);
    const userResources = grantableEntityUnion(
      userAssociationDetail.resources ?? [],
      unionOfRoleResources
    ) as AssociatedResource[];

    return userResources;
  }

  private async _validateRequestToUpdateUserResources(
    updateDto: UpdateUserResourcesDto,
    option?: ServiceOption
  ) {
    // validate resources
    updateDto.resources.forEach(resource => {
      if (!validateAssociatedResource(resource)) {
        throw new BadRequestException(errorMessage.AMBIGUOUS_ROLE_PERMISSIONS);
      }
    });

    // If resources contain permission to manage permissions of roles or users, throw error
    if (hasPermissionToManagePermissions(updateDto.resources)) {
      throw new BadRequestException(errorMessage.MANAGE_ROLE_PERMISSIONS_NOT_ALLOWED_USER);
    }

    // Validate resource integrity
    await this.resourceService.validateResourcesIntegrity(updateDto.resources, option);
  }

  private _buildSelfPrivileges(
    userPrivileges: UserPrivileges,
    systemResources: Resource[]
  ): SelfPrivileges {
    const systemResourcesMap = new Map(systemResources.map(resource => [resource.code, resource]));

    // Verify that the resources exist in the system and add additional fields required for self privilege
    const resources: MergedAssociatedResource[] = userPrivileges.resources
      .map(userResource => {
        const systemResource = systemResourcesMap.get(userResource.code);

        if (!systemResource) return null;

        const systemResourcePermissionsMap = new Map(
          systemResource.permissions.map(permission => [permission.code, permission])
        );

        const permissions = userResource.permissions
          .map(permission => {
            const systemResourcePermission = systemResourcePermissionsMap.get(permission.code);

            return systemResourcePermission ? { ...systemResourcePermission, ...permission } : null;
          })
          .filter(permission => permission !== null) as MergedAssociatedResourcePermission[];

        return {
          ...systemResource,
          permissions,
          isGranted: userResource.isGranted,
        };
      })
      .filter(resource => resource !== null) as MergedAssociatedResource[];

    return { resources, roles: userPrivileges.roles };
  }
}
