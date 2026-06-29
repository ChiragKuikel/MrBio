export type AuthorizationResource = {
  resource: string;
  permissions: string[];
};
export type AuthorizationPayload = {
  resourcePermission?: AuthorizationResource;
  parentResourcePermissions?: AuthorizationResource[];
};
