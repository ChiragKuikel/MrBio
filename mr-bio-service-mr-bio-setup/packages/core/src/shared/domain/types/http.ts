import { AuthEntity } from './auth-user';
import { Maybe, Nullable } from './object';
import { IncomingHttpHeaders } from 'http2';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from 'express';

export interface IHttpResponse<T = any> {
  data: Nullable<T>;
  count?: number;
  message?: string;
  error?: {
    key?: string;
    logMessage?: any;
    displayMessage?: string;
  };
  statusCode?: number;
  timestamp?: Date;
}
export interface RequestHeaders extends IncomingHttpHeaders {}

export type HttpRequest = ExpressRequest & {
  authEntity: Maybe<AuthEntity>;
  authService: Maybe<AuthService>;
  headers: RequestHeaders;
  isUnprotected: boolean;
  refreshTokenPayload: Maybe<RefreshTokenPayload>;
};

export interface RefreshTokenPayload {
  userId: string;
  deviceId: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface ClientRefreshTokenPayload {
  tokenId: string;
  clientId: string;
  iat?: number;
  exp?: number;
}

export type AuthService = { name: string };

export type HttpResponse = ExpressResponse;
export type NextFunction = ExpressNextFunction;
