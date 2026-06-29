import { CreateRoleDto } from './create-role';
import { AssociatedResource } from '../../../../shared/types/associated-resource';

export type UpdateRoleDto = Partial<CreateRoleDto>;

export type UpdateRoleResourcesDto = {
  resources: AssociatedResource[];
};
