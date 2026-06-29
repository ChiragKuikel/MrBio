import { BaseSchema } from '@mr-bio/core/external-lib';
import { ResourcePermission } from '../../domain/core/entities/resource';

export interface IResource {
  resourceId: string;
  code: string;
  name: string;
  description?: string;
  routePath?: string;
  isMenu?: boolean;
  icon?: string;
  activeIcon?: string;
  order: number;
  parent?: string;
  permissions: ResourcePermission[];
}

export type ResourceSchema = IResource & BaseSchema;
