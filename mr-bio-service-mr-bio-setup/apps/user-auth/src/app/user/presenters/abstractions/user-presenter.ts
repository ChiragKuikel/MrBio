import { User } from '../../domain/core/entities/user';
import { UserResponse } from '../response/user-response';
import { UpdateUserResourcesDto } from '../../domain/dtos/update-user-resources';
import { GrantedResource, AuthUser, FindAllResponse } from '@mr-bio/core/shared';
import { SelfPrivileges, UserPrivileges } from '../../domain/dtos/user-privileges';
import { UserWithGrantedPrivileges } from '../../domain/dtos/user-with-granted-privileges';
import { UpdateUserResourcesBody } from '../../controllers/validations/update-user-resources';
import {
  SelfPrivilegesResponse,
  UserPrivilegesResponse,
} from '../response/user-privileges-response';

export abstract class UserPresenter {
  abstract domainToPresentation(domain: User): UserResponse;
  abstract userWithGrantedPrivilegesToAuthUser(user: UserWithGrantedPrivileges): AuthUser;
  abstract findAllDomainToPresentation(
    domain: FindAllResponse<User>
  ): FindAllResponse<UserResponse>;
  abstract updateResourcesBodyToDto(body: UpdateUserResourcesBody): UpdateUserResourcesDto;
  abstract userPrivilegesToResponse(userPrivileges: UserPrivileges): UserPrivilegesResponse;
  abstract selfPrivilegesToResponse(selfPrivileges: SelfPrivileges): SelfPrivilegesResponse;
  abstract userPrivilegesToGrantedResources(userPrivileges: UserPrivileges): GrantedResource[];
}
