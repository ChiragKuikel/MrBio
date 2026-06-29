import { Privileges } from '../types/privilege';
import { deleteProperty, GrantedResource, isDefined } from '@mr-bio/core/shared';
import { HierarchicalAssociatedResourceBody } from '../validations/update-associated-resource';
import { AssociatedResource, HierarchicalAssociatedResource } from '../types/associated-resource';

export function hasResourceAndPermission(
  resources: AssociatedResource[],
  resourceCode: string,
  permissionCode: string,
  shouldBeGranted = false
): boolean {
  return resources.some(
    resource =>
      resource.code === resourceCode &&
      resource.permissions.some(permission => {
        if (shouldBeGranted && !permission.isGranted) {
          return false;
        }

        return permission.code === permissionCode;
      })
  );
}

export function validateAssociatedResource(resource: AssociatedResource): boolean {
  const { isGranted, permissions } = resource;

  if (!permissions.length) {
    true;
  }

  const uniquePermissionGrants = new Set(permissions.map(p => p.isGranted ?? false));
  const SINGLE_GRANT_COUNT = 1;
  const resourceHasPermissionsWithSameGrantStatus =
    uniquePermissionGrants.size === SINGLE_GRANT_COUNT;

  // If all the permissions have same grant status, check if it matches with the resource's grant status
  if (resourceHasPermissionsWithSameGrantStatus) {
    const permissionsGrantStatus = Array.from(uniquePermissionGrants)[0];
    if (permissionsGrantStatus !== isGranted) {
      return false;
    }
  }

  // If resource is not granted, check if all the permissions have the same grant status.
  // The grant status of all permissions should be false which is verified by above check
  if (!isGranted && !resourceHasPermissionsWithSameGrantStatus) {
    return false;
  }

  return true;
}

export function flattenAndFilterAssociatedResources(
  updateResources: HierarchicalAssociatedResourceBody[]
): AssociatedResource[] {
  const flattenedResources: AssociatedResource[] = [];

  updateResources.forEach(resource => {
    // Flatten subModules if they exist
    if (resource.subModules?.length) {
      const flattenedSubModules = flattenAndFilterAssociatedResources(resource.subModules);
      flattenedResources.push(...flattenedSubModules);
    }

    // Filter out unassociated permissions
    resource.permissions = resource.permissions.filter(p => isDefined(p.isGranted));

    // If the grant status of resource is not defined but it has some associated permissions, define its grant status
    if (!isDefined(resource.isGranted) && resource.permissions.length) {
      // Resource is granted if atleast one permission is granted
      resource.isGranted = resource.permissions.findIndex(permission => permission.isGranted) > -1;
    }

    if (isDefined(resource.isGranted)) {
      // Add the current resource to the flattenedResources array by deleteing the subModules field
      deleteProperty(resource, ['subModules']);
      flattenedResources.push(resource as AssociatedResource);
    }
  });

  return flattenedResources;
}

export function createAssociatedResourcesHierarchy(
  associatedResources: AssociatedResource[]
): HierarchicalAssociatedResource[] {
  const parentResources = associatedResources.filter(resource => !resource.parent);

  const resourceHierarchy = new Map<string, HierarchicalAssociatedResource>();
  parentResources.forEach(resource =>
    resourceHierarchy.set(resource.code, resource as HierarchicalAssociatedResource)
  );

  const childResources = associatedResources.filter(resource => resource.parent);
  childResources.forEach(resource => {
    const parentResource = resourceHierarchy.get(resource.parent!);

    if (parentResource) {
      if (!parentResource.subModules) {
        parentResource.subModules = [];
      }
      parentResource.subModules.push(resource as HierarchicalAssociatedResource);
    }
  });

  return Array.from(resourceHierarchy.values());
}

export function privilegesToGrantedResources(userPrivileges: Privileges): GrantedResource[] {
  const grantedResources: GrantedResource[] = [];

  userPrivileges.resources.forEach(resource => {
    const permissions = resource.permissions.map(p => p.code);
    grantedResources.push({
      permissions,
      code: resource.code,
    });
  });

  return grantedResources;
}
