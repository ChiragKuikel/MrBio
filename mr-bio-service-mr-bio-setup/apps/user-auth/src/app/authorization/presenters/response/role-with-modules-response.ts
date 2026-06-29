import { RoleInfo } from '../../domain/dtos/role-info';
import { HierarchicalAssociatedResource } from '../../../../shared/types/associated-resource';

export type RoleWithModulesResponse = {
  modules: HierarchicalAssociatedResource[];
  role: RoleInfo;
};
