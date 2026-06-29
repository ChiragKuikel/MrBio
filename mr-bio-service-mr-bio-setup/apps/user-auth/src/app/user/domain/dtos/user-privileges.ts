import { Privileges } from '../../../../shared/types/privilege';
import { RoleInfo } from '../../../authorization/domain/dtos/role-info';
import { MergedAssociatedResource } from '../../../../shared/types/associated-resource';

export type UserPrivileges = Privileges;

export type SelfPrivileges = {
  roles: RoleInfo[];
  resources: MergedAssociatedResource[];
};
