import { BaseEntity, toKebabCase } from '@mr-bio/core/shared';

export class Resource extends BaseEntity {
  code: string;
  name: string;
  description?: string;
  routePath?: string;
  icon?: string;
  isMenu?: boolean;
  order: number;
  parent?: string;
  permissions: ResourcePermission[];

  initialize(builder: {
    name: string;
    description?: string;
    routePath?: string;
    icon?: string;
    order: number;
    parent?: string;
    permissions?: { label: string; description?: string }[];
  }) {
    this.name = builder.name;
    this.code = toKebabCase(this.name, true);
    this.description = builder.description;
    this.routePath = builder.routePath;
    this.icon = builder.icon;
    this.order = builder.order;
    this.parent = builder.parent;
    this.setPermissions(builder.permissions ?? []);
  }

  setPermissions(permissions: { label: string; description?: string }[]) {
    this.permissions = permissions.map(p => ({
      label: p.label,
      description: p.description,
      code: toKebabCase(p.label, true),
    }));
  }
}

export type ResourcePermission = {
  code: string;
  label: string;
  isRequiredForAdmin?: boolean;
  description?: string;
};
