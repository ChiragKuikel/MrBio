import { hasResourceAndPermission } from './associated-resource';
import { AssociatedResource } from '../types/associated-resource';
import { ResourceCode, RoleCode, resourcePermissions } from '@mr-bio/core/shared';

export function isAllowedToManageRolesAndPermissions(role?: string) {
  if (role === RoleCode.ORGANIZATION_ADMIN || role === RoleCode.SUPER_ADMIN) {
    return true;
  }

  return false;
}

export function hasGrantedPermissionToManagePermissions(resources: AssociatedResource[]): boolean {
  return (
    hasResourceAndPermission(
      resources,
      ResourceCode.ROLES_PERMISSIONS_MANAGEMENT,
      resourcePermissions[ResourceCode.ROLES_PERMISSIONS_MANAGEMENT].manage,
      true
    ) &&
    hasResourceAndPermission(
      resources,
      ResourceCode.USER_MANAGEMENT,
      resourcePermissions[ResourceCode.USER_MANAGEMENT].manage,
      true
    )
  );
}

export function hasPermissionToManagePermissions(resources: AssociatedResource[]): boolean {
  return (
    hasResourceAndPermission(
      resources,
      ResourceCode.ROLES_PERMISSIONS_MANAGEMENT,
      resourcePermissions[ResourceCode.ROLES_PERMISSIONS_MANAGEMENT].manage
    ) ||
    hasResourceAndPermission(
      resources,
      ResourceCode.USER_MANAGEMENT,
      resourcePermissions[ResourceCode.USER_MANAGEMENT].manage
    )
  );
}
