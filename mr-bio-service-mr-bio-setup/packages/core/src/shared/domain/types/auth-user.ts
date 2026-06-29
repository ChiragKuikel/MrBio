import { ClientAssigner } from './assigner';
import { AuthGrantType } from '../enum/auth';
import { GrantedResource } from './resource';

export type CommonAuthEntity = {
  // organizationId: string;
  // organizationName: string;
  roles?: string[];
  // networkIds?: string[];
  grantedResources: GrantedResource[];
  iat?: number;
  exp?: number;
  grantType: AuthGrantType;
};

export type AuthUser = CommonAuthEntity & {
  id: string;
  userId?: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  grantType: AuthGrantType.USER_CREDENTIALS;
};

export type AuthClient = CommonAuthEntity & {
  id: string;
  userId?: string;
  tokenId: string;
  allowedSources: string[];
  grantType: AuthGrantType.CLIENT_CREDENTIALS;
  /**
   * Assigner sent by client for the request
   */
  assigner?: ClientAssigner;
};

export type AuthEntity = AuthUser | AuthClient;
