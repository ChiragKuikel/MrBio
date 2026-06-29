import { SYSTEM } from '../constants';
import { isAuthEntityUser } from './auth';
import { getCurrentUTCDate } from './date';
import { AdminAssigner, Assigner, ServiceOption } from '../types';

/**
 * The function `resolveAssigner` returns an `AssignerEntity` object with the current date and the name
 * of the authenticated user, and optionally includes the user's ID.
 * @param {ServiceOption} options - An object that contains optional parameters for the
 * resolveAssigner function. It has a default value of an empty object if no argument is provided.
 * @returns an object of type AssignerEntity.
 */
export function resolveAssigner(options: ServiceOption = {}): Assigner {
  const { authEntity } = options;

  const assigner: Assigner = { at: getCurrentUTCDate(), by: '' };

  if (!authEntity) {
    return assigner;
  }

  if (isAuthEntityUser(authEntity)) {
    assigner.by = authEntity.fullName;
    if (authEntity.id) {
      assigner.id = authEntity.id;
    }
  }

  return assigner;
}

/**
 * The function `resolveAdminAssigner` returns an `AdminAssignerEntity` object with the current date
 * and the name of the authenticated user or "SYSTEM" if no user is provided.
 * @param {ServiceOption} options - An object that contains optional parameters for the function. It
 * has a default value of an empty object.
 * @returns an object of type AdminAssignerEntity.
 */
export function resolveAdminAssigner(options: ServiceOption = {}): AdminAssigner {
  const { authEntity } = options;

  const assigner: AdminAssigner = {
    at: getCurrentUTCDate(),
    by: SYSTEM,
  };

  if (!authEntity) {
    return assigner;
  }

  if (isAuthEntityUser(authEntity)) {
    assigner.by = authEntity.fullName;
  }

  return assigner;
}
