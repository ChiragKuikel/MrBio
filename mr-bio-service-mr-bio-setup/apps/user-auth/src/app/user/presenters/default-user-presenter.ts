import { Injectable } from '@nestjs/common';
import { User } from '../domain/core/entities/user';
import { UserResponse } from './response/user-response';
import { UserPresenter } from './abstractions/user-presenter';
import { UpdateUserResourcesDto } from '../domain/dtos/update-user-resources';
import { SelfPrivileges, UserPrivileges } from '../domain/dtos/user-privileges';
import { UserWithGrantedPrivileges } from '../domain/dtos/user-with-granted-privileges';
import { UpdateUserResourcesBody } from '../controllers/validations/update-user-resources';
import { GrantedResource, AuthUser, FindAllResponse, AuthGrantType } from '@mr-bio/core/shared';
import { HierarchicalMergedAssociatedResource } from '../../../shared/types/associated-resource';
import {
  SelfPrivilegesResponse,
  UserPrivilegesResponse,
} from './response/user-privileges-response';
import {
  createAssociatedResourcesHierarchy,
  flattenAndFilterAssociatedResources,
  privilegesToGrantedResources,
} from '../../../shared/utils/associated-resource';

@Injectable()
export class DefaultUserPresenter implements UserPresenter {
  domainToPresentation(domain: User): UserResponse {
    return {
      id: domain.id,
      dob: domain.dob,
      email: domain.email,
      phones: domain.phones,
      gender: domain.gender,
      address: domain.address,
      lastName: domain.lastName,
      username: domain.username,
      firstName: domain.firstName,
      middleName: domain.middleName,
      roles: domain.association?.roles ?? [],
    };
  }

  userWithGrantedPrivilegesToAuthUser(user: UserWithGrantedPrivileges): AuthUser {
    return {
      id: user.id,
      email: user.email,
      lastName: user.lastName,
      fullName: user.fullName,
      firstName: user.firstName,
      middleName: user.middleName,

      roles: user.grantedPrivileges.roles.map(r => r.code),
      grantedResources: this.userPrivilegesToGrantedResources(user.grantedPrivileges),
      grantType: AuthGrantType.USER_CREDENTIALS,
    };
  }

  findAllDomainToPresentation(domain: FindAllResponse<User>): FindAllResponse<UserResponse> {
    return domain.map(d => this.domainToPresentation(d));
  }

  updateResourcesBodyToDto(body: UpdateUserResourcesBody): UpdateUserResourcesDto {
    return { resources: flattenAndFilterAssociatedResources(body.resources) };
  }

  userPrivilegesToResponse(userPrivileges: UserPrivileges): UserPrivilegesResponse {
    return {
      roles: userPrivileges.roles,
      modules: createAssociatedResourcesHierarchy(userPrivileges.resources),
    };
  }

  selfPrivilegesToResponse(selfPrivileges: SelfPrivileges): SelfPrivilegesResponse {
    return {
      roles: selfPrivileges.roles,
      modules: createAssociatedResourcesHierarchy(
        selfPrivileges.resources
      ) as HierarchicalMergedAssociatedResource[],
    };
  }

  userPrivilegesToGrantedResources(userPrivileges: UserPrivileges): GrantedResource[] {
    return privilegesToGrantedResources(userPrivileges);
  }
}
