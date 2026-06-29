import { Role } from './core/entities/role';
import { Injectable } from '@nestjs/common';
import { RoleInfo } from './dtos/role-info';
import { CreateRoleDto } from './dtos/create-role';
import { RoleQueryOptions } from './dtos/role-query';
import { errorMessage } from '../../../shared/constants';
import { RoleService } from './abstractions/role-service';
import { Privileges } from '../../../shared/types/privilege';
import { ResourceService } from './abstractions/resource-service';
import { UpdateRoleDto, UpdateRoleResourcesDto } from './dtos/update-role';
import { RoleRepository } from '../repository/abstractions/role-repository';
import { rolesResourceUnion } from '../../../shared/utils/grantable-entity';
import {
  ServiceOption,
  PaginatedResponse,
  formatModuleMessage,
  coreErrorMessage,
  ConflictException,
  RoleCode,
  ForbiddenException,
  NotFoundException,
  replaceDynamicVariables,
  BadRequestException,
  toKebabCase,
  ProjectModule,
  CountResponse,
  withOnlyAttrs,
  FindAllResponse,
} from '@mr-bio/core/shared';

@Injectable()
export class RoleServiceImpl implements RoleService {
  constructor(
    private resourceService: ResourceService,
    private roleRepository: RoleRepository
  ) {}

  async create(createDto: CreateRoleDto, option?: ServiceOption): Promise<Role> {
    const role = new Role();
    role.initialize(createDto);

    if (role.code === RoleCode.SUPER_ADMIN) {
      throw new ForbiddenException();
    }

    const existingRole = await this.roleRepository.findOneByCode(role.code, option);
    if (existingRole) {
      throw new ConflictException(
        formatModuleMessage(coreErrorMessage.MODULE_ALREADY_EXISTS, ProjectModule.ROLE)
      );
    }

    return await this.roleRepository.create(role, option);
  }

  async count(query: RoleQueryOptions, option?: ServiceOption): Promise<CountResponse> {
    return await this.roleRepository.count(query, option);
  }

  async get(query: RoleQueryOptions, option?: ServiceOption): Promise<PaginatedResponse<Role>> {
    return await this.roleRepository.findAll(query, option);
  }

  async getRoleInfos(
    query: RoleQueryOptions,
    option?: ServiceOption
  ): Promise<FindAllResponse<RoleInfo>> {
    return await this.roleRepository.findRoleInfos(query, option);
  }

  async getRoleInfoById(id: string, option?: ServiceOption): Promise<RoleInfo> {
    const role = await this.roleRepository.findRoleInfoById(id, option);
    if (!role)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.ROLE)
      );

    return role;
  }

  async getOneById(id: string, option?: ServiceOption): Promise<Role> {
    const role = await this.roleRepository.findOneById(id, option);
    if (!role)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.ROLE)
      );

    return role;
  }

  async getOneByCode(code: string, option?: ServiceOption): Promise<Role> {
    const role = await this.roleRepository.findOneByCode(code, option);
    if (!role)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.ROLE)
      );

    return role;
  }

  async updateById(id: string, updateDto: UpdateRoleDto, option?: ServiceOption): Promise<Role> {
    const role = await this.getOneById(id, option);

    if (role.code === RoleCode.SUPER_ADMIN) {
      throw new ForbiddenException();
    }

    if (updateDto.name) {
      const existingRoleWithName = await this.roleRepository.findOneByCode(
        toKebabCase(updateDto.name, true),
        option
      );

      if (existingRoleWithName && existingRoleWithName.id !== id) {
        throw new BadRequestException(
          formatModuleMessage(coreErrorMessage.MODULE_ALREADY_EXISTS, 'Role with name')
        );
      }
    }

    return (await this.roleRepository.updateById(id, updateDto, option))!;
  }

  async updateResourcesById(
    id: string,
    updateDto: UpdateRoleResourcesDto,
    option: ServiceOption
  ): Promise<Role> {
    // Validate resource integrity
    await this.resourceService.validateResourcesIntegrity(updateDto.resources, option);

    const role = await this.getOneById(id, option);

    role.setResources(updateDto.resources);

    return (await this.roleRepository.update(role, option))!;
  }

  async deleteById(id: string, option?: ServiceOption): Promise<void> {
    const role = await this.getOneById(id, option);

    if (role.code === RoleCode.SUPER_ADMIN) {
      throw new ForbiddenException();
    }

    const usersWithRole = await this.roleRepository.countUsersById(role.id, option);
    if (usersWithRole > 0) {
      throw new BadRequestException(
        replaceDynamicVariables(errorMessage.ROLE_DELETION_DENIED_DUE_TO_ASSOCIATED_USERS, {
          associatedUserCount: usersWithRole,
        })
      );
    }

    return await this.roleRepository.deleteById(id, option);
  }

  async getRolePrivilegesByCodes(codes: string[], option?: ServiceOption): Promise<Privileges> {
    const roles = await this.roleRepository.findAllByCodes(codes, option);

    const resources = rolesResourceUnion(roles);

    return {
      roles: roles.map(role => withOnlyAttrs<RoleInfo>(role, ['name', 'code'])),
      resources,
    };
  }
}
