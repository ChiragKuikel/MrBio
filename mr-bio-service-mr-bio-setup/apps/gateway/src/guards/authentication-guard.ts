import axios from 'axios';
import jwt from 'jsonwebtoken';
import { extractCookies } from '@mr-bio/core/external-lib';
import {
  ACCESS_TOKEN_COOKIE_KEY,
  AUTH_ENTITY_HEADER,
  DomainException,
  HttpRequest,
  HttpResponse,
  AuthUser,
  IHttpResponse,
  Maybe,
  NextFunction,
  Nullable,
  ORGANIZATION_ID_HEADER,
  coreErrorMessage,
  isSuperAdmin,
  serviceRoute,
  AuthEntity,
  AuthClient,
  isAuthEntityUser,
  AUTHORIZATION_HEADER,
} from '@mr-bio/core/shared';

const USER_AUTH_SERVICE = process.env.USER_AUTH_SERVICE;
const AUTH_TOKEN_SECRET = '50dac8e8d79154a0e20e48fc6e4291DEV76e38139eddcbb021d2e4cda92aad83a87';

export class AuthenticationGuard {
  async activate(
    request: HttpRequest,
    response: HttpResponse,
    next: NextFunction,
    unprotectedRoutes?: string[]
  ) {
    const isUnprotected = this._isUnprotected(request, unprotectedRoutes);

    const token = this._extractToken(request);
    if (!token) {
      if (isUnprotected) return next();

      return this._sendErrorResponse(response, coreErrorMessage.ACCESS_TOKEN_REQUIRED);
    }

    // validate token integrity
    const { isValid, decodedToken } = this._verifyJwt(token);
    if (!isValid) return this._sendErrorResponse(response, coreErrorMessage.ACCESS_TOKEN_INVALID);

    const authEntityFromToken = decodedToken as any;

    // const authEntity = await this._validateAuthEntity(authEntityFromToken);
    if (!authEntityFromToken) {
      return this._sendErrorResponse(response);
    }

    // Use organizationId from header for super admin
    // const organizationIdFromHeader = request.headers[ORGANIZATION_ID_HEADER] as Maybe<string>;
    // if (isSuperAdmin(authEntity) && organizationIdFromHeader) {
    //   // authEntity.organizationId = organizationIdFromHeader;
    // }

    request.headers[AUTH_ENTITY_HEADER] = JSON.stringify(authEntityFromToken);

    next();
  }

  private _extractToken(request: HttpRequest): Maybe<string> {
    return this._extractTokenFromHeader(request) ?? this._extractTokenFromCookie(request);
  }

  private _extractTokenFromHeader(request: HttpRequest): Maybe<string> {
    const authorizationHeader = request.headers[AUTHORIZATION_HEADER] as Maybe<string>;
    if (!authorizationHeader) return undefined;

    const [type, token] = authorizationHeader.split(' ');

    return type === 'Bearer' ? token : undefined;
  }

  private _extractTokenFromCookie(request: HttpRequest): Maybe<string> {
    const cookies = extractCookies(request); // Done because cookies not available in request.cookies, so extracted from headers

    return cookies[ACCESS_TOKEN_COOKIE_KEY];
  }

  private _verifyJwt(token: string) {
    const decodedToken = jwt.decode(token) as jwt.JwtPayload;
    try {
      jwt.verify(token, '50dac8e8d79154a0e20e48fc6e4291DEV76e38139eddcbb021d2e4cda92aad83a87');

      return {
        decodedToken,
        isValid: true,
      };
    } catch (error: any) {
      return {
        decodedToken,
        isValid: false,
        error: error.name,
      };
    }
  }

  private _sendErrorResponse(response: HttpResponse, message?: string) {
    const httpResponse: IHttpResponse = {
      data: null,
      error: {
        displayMessage: message ?? coreErrorMessage.UNAUTHENTICATED_ACCESS,
      },
    };
    response.status(401).json(httpResponse);
  }

  private async _validateAuthEntity(authEntity: AuthEntity): Promise<Nullable<AuthEntity>> {
    if (isAuthEntityUser(authEntity)) {
      return await this._validateAuthUser(authEntity as AuthUser);
    }

    return await this._validateAuthClient(authEntity);
  }

  private async _validateAuthUser(authUser: AuthUser): Promise<Nullable<AuthUser>> {
    try {
      const response = await axios.get(
        `${USER_AUTH_SERVICE}${serviceRoute.USER_AUTH_VALIDATE_USER.replace(':id', authUser.id)}`
      );

      if (!response.data.data) {
        throw new DomainException(coreErrorMessage.DEFAULT_ERROR);
      }

      return response.data.data;
    } catch (err) {
      return null;
    }
  }

  private async _validateAuthClient(authClient: AuthClient): Promise<Nullable<AuthClient>> {
    try {
      const response = await axios.get(
        `${USER_AUTH_SERVICE}${serviceRoute.USER_AUTH_VALIDATE_CLIENT_TOKEN.replace(':id', authClient.id).replace(':tokenId', authClient.tokenId)}`
      );

      if (!response.data.data) {
        throw new DomainException(coreErrorMessage.DEFAULT_ERROR);
      }

      return response.data.data;
    } catch (err) {
      return null;
    }
  }

  private _isUnprotected(request: HttpRequest, unprotectedRoutes?: string[]): boolean {
    if (unprotectedRoutes) {
      return unprotectedRoutes.some(route => {
        const regex = new RegExp(`^${route.replace('*', '.*')}$`);

        const requestPath = request.path;

        return requestPath === route || regex.test(requestPath);
      });
    }

    return false;
  }
}
