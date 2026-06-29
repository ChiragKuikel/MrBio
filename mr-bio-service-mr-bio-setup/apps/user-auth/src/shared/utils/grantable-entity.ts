import { GrantableEntity } from '../types/grantable-entity';
import { AssociatedResource } from '../types/associated-resource';

export function rolesResourceUnion(
  roles: {
    code: string;
    name: string;
    resources: AssociatedResource[];
  }[]
): AssociatedResource[] {
  let unionOfResources: AssociatedResource[] = [];

  roles.forEach(role => {
    unionOfResources = grantableEntityUnion(
      unionOfResources,
      role.resources,
      true
    ) as AssociatedResource[];
  });

  return unionOfResources;
}

export function filterGrantedGrantableEntites(
  grantableEntities: GrantableEntity[]
): GrantableEntity[] {
  const grantedEntities: GrantableEntity[] = [];

  grantableEntities.forEach(grantableEntity => {
    if (!grantableEntity.isGranted) return;

    if (grantableEntity.permissions?.length) {
      grantableEntity.permissions = filterGrantedGrantableEntites(
        grantableEntity.permissions ?? []
      );
    }

    grantedEntities.push(grantableEntity);
  });

  return grantedEntities;
}

export function grantableEntityUnion(
  setA: GrantableEntity[],
  setB: GrantableEntity[],
  prioritizeFirstSet = true
): GrantableEntity[] {
  const unionOfGrantablesMap = new Map<string, GrantableEntity>();

  setA.forEach(grantableEntity => unionOfGrantablesMap.set(grantableEntity.code, grantableEntity));

  setB.forEach(entityToProcess => {
    const existingEntityInMap = unionOfGrantablesMap.get(entityToProcess.code);
    if (!existingEntityInMap) {
      unionOfGrantablesMap.set(entityToProcess.code, entityToProcess);
    } else {
      const mergedEntity: GrantableEntity = { ...existingEntityInMap };

      if (!prioritizeFirstSet) {
        if (entityToProcess.isGranted) {
          mergedEntity.isGranted = true;
        }
      }

      const unionOfPermissions = grantableEntityUnion(
        existingEntityInMap.permissions ?? [],
        entityToProcess.permissions ?? [],
        prioritizeFirstSet
      );

      if (unionOfPermissions.length) {
        mergedEntity.permissions = [...unionOfPermissions];
      }

      unionOfGrantablesMap.set(mergedEntity.code, mergedEntity);
    }
  });

  return Array.from(unionOfGrantablesMap.values());
}

export function grantableEntityDifference(
  setA: GrantableEntity[],
  setB: GrantableEntity[]
): GrantableEntity[] {
  const differenceOfGrantablesMap = new Map<string, GrantableEntity>();

  setA.forEach(grantableEntity =>
    differenceOfGrantablesMap.set(grantableEntity.code, grantableEntity)
  );

  setB.forEach(entityToProcess => {
    const existingEntityInMap = differenceOfGrantablesMap.get(entityToProcess.code);

    // If the entity is not present in first set, do nothing
    if (!existingEntityInMap) return;

    // Find difference of Permissions
    const differenceOfPermissions = grantableEntityDifference(
      existingEntityInMap.permissions ?? [],
      entityToProcess.permissions ?? []
    );

    // If the grant status is same and there is no difference in permissions, remove the entity from map (subtracted)
    if (existingEntityInMap.isGranted === entityToProcess.isGranted) {
      if (!differenceOfPermissions.length) {
        differenceOfGrantablesMap.delete(existingEntityInMap.code);

        return;
      }
    }
    if (differenceOfPermissions.length) {
      existingEntityInMap.permissions = differenceOfPermissions;
    }
    differenceOfGrantablesMap.set(existingEntityInMap.code, existingEntityInMap);
  });

  return Array.from(differenceOfGrantablesMap.values());
}
