export type CreateResourceDto = {
  name: string;
  order: number;
  icon?: string;
  parent?: string;
  routePath?: string;
  description?: string;
  permissions?: { label: string; description?: string }[];
};
