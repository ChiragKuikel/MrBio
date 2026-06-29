import { AssociatedResource } from './associated-resource';
import { RoleInfo } from '../../app/authorization/domain/dtos/role-info';

export type Privileges = {
  roles: RoleInfo[];
  resources: AssociatedResource[];
};
