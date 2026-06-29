import { User } from '../core/entities/user';
import { ServiceOption } from '@mr-bio/core/shared';
import { AssignRolesToUserDto } from '../dtos/assign-roles-to-user';
import { UpdateUserResourcesDto } from '../dtos/update-user-resources';
import { SelfPrivileges, UserPrivileges } from '../dtos/user-privileges';
import { AssociatedResource } from '../../../../shared/types/associated-resource';

export abstract class UserPrivilegesService {
  abstract assignRolesToUser(
    userId: string,
    assignDto: AssignRolesToUserDto,
    option: ServiceOption
  ): Promise<User>;
  abstract updateUserResources(
    userId: string,
    updateDto: UpdateUserResourcesDto,
    option: ServiceOption
  ): Promise<AssociatedResource[]>;
  abstract getSelfPrivileges(option: ServiceOption): Promise<SelfPrivileges>;
  abstract getUserPrivileges(userId: string, option: ServiceOption): Promise<UserPrivileges>;
  abstract getUserGrantedPrivileges(
    userId: string,
    option?: ServiceOption
  ): Promise<UserPrivileges>;
}
