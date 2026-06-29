import { BaseSchema } from '@mr-bio/core/external-lib';
import { AssociatedResource } from '../../../../shared/types/associated-resource';

export interface IRole {
  roleId: string;
  name: string;
  code: string;
  resources: AssociatedResource[];
}

export type RoleSchema = IRole & BaseSchema;
