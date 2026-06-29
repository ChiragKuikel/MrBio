import { WithSubModules } from './with-sub-modules';

export type AssociatedResource = {
  code: string;
  parent?: string;
  isGranted: boolean;
  permissions: AssociatedResourcePermission[];
};

export type AssociatedResourcePermission = {
  isGranted: boolean;
  code: string;
};

export type MergedAssociatedResource = AssociatedResource & {
  name: string;
  description?: string;
  routePath?: string;
  icon?: string;
  order: number;
  permissions: MergedAssociatedResourcePermission[];
};

export type MergedAssociatedResourcePermission = AssociatedResourcePermission & {
  label: string;
  description?: string;
};

export type HierarchicalAssociatedResource = WithSubModules<AssociatedResource>;
export type HierarchicalMergedAssociatedResource = WithSubModules<MergedAssociatedResource>;
