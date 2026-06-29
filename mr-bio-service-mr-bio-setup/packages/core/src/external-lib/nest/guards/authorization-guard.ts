import { Reflector } from '@nestjs/core';
import { AUTHORIZATION_KEY } from '../decorators/authorize';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthorizationPayload } from '../../../shared/domain/types/authorization';
import { ForbiddenException } from '../../../shared/domain/exception/forbidden-exception';
import {
  BaseConfigService,
  GrantedResource,
  HttpRequest,
  Maybe,
  SERVICE_AUTHORIZATION_HEADER,
  TokenHelper,
  AuthEntity,
} from '../../../shared';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenHelper: TokenHelper,
    private configService: BaseConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this._getRequiredPermissions(context);
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<HttpRequest>();

    // Check if the request was sent by a microservice
    const serviceToken = this._extractServiceTokenFromHeader(request);
    if (serviceToken) {
      const { isValid, decodedToken } = this.tokenHelper.verify(
        serviceToken,
        this.configService.app.serviceJwtSecret
      );
      if (isValid) {
        request.authService = { name: (decodedToken as any).sub };

        return true;
      }
    }

    if (!request.authEntity) {
      throw new ForbiddenException();
    }

    const grantedUserResources = await this._getUserGrantedResources(request.authEntity);

    if (this._hasParentResourcePermissions(requiredPermissions, grantedUserResources)) {
      return true;
    }

    this._validateResourcePermission(requiredPermissions, grantedUserResources);

    return true;
  }

  private _extractServiceTokenFromHeader(request: HttpRequest): Maybe<string> {
    const authHeader = (request.headers[SERVICE_AUTHORIZATION_HEADER] as string) ?? '';
    const [type, token] = authHeader.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }

  private _getRequiredPermissions(context: ExecutionContext): AuthorizationPayload | undefined {
    return this.reflector.getAllAndOverride<AuthorizationPayload>(AUTHORIZATION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private async _getUserGrantedResources(authEntity: AuthEntity): Promise<GrantedResource[]> {
    return authEntity.grantedResources;
  }

  private _hasParentResourcePermissions(
    requiredPermissions: AuthorizationPayload,
    grantedUserResources: GrantedResource[]
  ): boolean {
    if (requiredPermissions.parentResourcePermissions?.length) {
      return requiredPermissions.parentResourcePermissions.some(parentResource =>
        grantedUserResources.some(
          userResource =>
            userResource.code === parentResource.resource &&
            this._hasRequiredPermissions(userResource.permissions, parentResource.permissions)
        )
      );
    }

    return false;
  }

  private _validateResourcePermission(
    requiredPermissions: AuthorizationPayload,
    grantedUserResources: GrantedResource[]
  ): void {
    if (requiredPermissions.resourcePermission) {
      const grantedResource = grantedUserResources.find(
        userResource => userResource.code === requiredPermissions.resourcePermission?.resource
      );

      if (
        !grantedResource ||
        !this._hasRequiredPermissions(
          grantedResource.permissions,
          requiredPermissions.resourcePermission.permissions
        )
      ) {
        throw new ForbiddenException();
      }
    }
  }

  private _hasRequiredPermissions(
    permissionsToCheck: string[],
    requiredPermissions: string[]
  ): boolean {
    return permissionsToCheck.some(permission => requiredPermissions.includes(permission));
  }
}
