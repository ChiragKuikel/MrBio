import { Resource } from '../core/entities/resource';

export type ResourceWithSubModules = Resource & {
  subModules: ResourceWithSubModules[];
};
