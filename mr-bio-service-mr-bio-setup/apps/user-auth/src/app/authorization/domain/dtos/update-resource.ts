export type UpdateResourceDto = Partial<{
  name: string;
  icon: string;
  order: number;
  parent: string;
  routePath: string;
  description: string;
}>;

export type UpdateResourcePermissionsDto = {
  permissions: { label: string; description?: string }[];
};
