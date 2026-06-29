import { RoleInfo } from '../../../authorization/domain/dtos/role-info';
import {
  HierarchicalAssociatedResource,
  HierarchicalMergedAssociatedResource,
} from '../../../../shared/types/associated-resource';

export type UserPrivilegesResponse = {
  roles: RoleInfo[];
  modules: HierarchicalAssociatedResource[];
};

export type SelfPrivilegesResponse = {
  roles: RoleInfo[];
  modules: HierarchicalMergedAssociatedResource[];
};
