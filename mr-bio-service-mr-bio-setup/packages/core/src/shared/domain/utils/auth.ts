import { coreErrorMessage } from '../constants';
import { ServiceOption } from '../types/service';
import { AuthGrantType, RoleCode } from '../enum';
import { AuthClient, AuthEntity, AuthUser } from '../types';
import { UnauthorizedException } from '../exception/unauthorized-exception';

/**
 * Extracts userId from `ServiceOption`. If not found, throws an error.
 * @param serviceOption The service options containing authentication user information.
 * @returns The extracted `userId`.
 */
export function extractAuthUserId(serviceOption: ServiceOption): string {
  const userId = serviceOption.authEntity?.id;

  if (!userId) throw new UnauthorizedException(coreErrorMessage.UNAUTHENTICATED_ACCESS);

  return userId;
}

/**
 * Extracts auth user from `ServiceOption`. If not found, throws an error.
 * @param serviceOption The service options containing authentication user information.
 * @returns The extracted authentication user.
 */
export function extractAuthUser(serviceOption: ServiceOption): AuthUser {
  const authEntity = serviceOption.authEntity;
  if (!authEntity) throw new UnauthorizedException(coreErrorMessage.UNAUTHENTICATED_ACCESS);

  if (!isAuthEntityUser(authEntity)) {
    throw new UnauthorizedException(coreErrorMessage.UNAUTHENTICATED_ACCESS);
  }

  return authEntity;
}

/**
 * Extracts auth entity from `ServiceOption`. If not found, throws an error.
 * @param serviceOption The service options containing authentication entity information.
 * @returns The extracted authentication entity.
 */
export function extractAuthEntity(serviceOption: ServiceOption): AuthEntity {
  const authEntity = serviceOption.authEntity;
  if (!authEntity) throw new UnauthorizedException(coreErrorMessage.UNAUTHENTICATED_ACCESS);

  return authEntity;
}

/**
 * Determines if the authenticated user has the role of a super admin.
 * @param authEntity The authenticated user whose roles are to be checked.
 * @returns `true` if the user has the `SUPER_ADMIN` role, otherwise `false`.
 */
export function isSuperAdmin(authEntity: AuthEntity): boolean {
  return authEntity.roles?.includes(RoleCode.SUPER_ADMIN) ?? false;
}

/**
 * Determines if the authenticated user has the role of a network admin.
 * @param authEntity The authenticated user whose roles are to be checked.
 * @returns `true` if the user has the `NETWORK_ADMIN` role, otherwise `false`.
 */
export function isNetworkAdmin(authEntity: AuthEntity): boolean {
  return authEntity.roles?.includes(RoleCode.NETWORK_ADMIN) ?? false;
}

/**
 * Determines if the authenticated entity is a client.
 * @param authEntity The authenticated entity to be checked.
 * @returns `true` if the entity is a client, otherwise `false`.
 */
export function isAuthEntityClient(authEntity: AuthEntity): authEntity is AuthClient {
  return authEntity.grantType === AuthGrantType.CLIENT_CREDENTIALS;
}

/**
 * Determines if the authenticated entity is a user.
 * @param authEntity The authenticated entity to be checked.
 * @returns `true` if the entity is a user, otherwise `false`.
 */
export function isAuthEntityUser(authEntity: AuthEntity): authEntity is AuthUser {
  return authEntity.grantType === AuthGrantType.USER_CREDENTIALS;
}
