import { Reflector } from '@nestjs/core';
import { IS_ANONYMOUS_KEY } from '../decorators/anonymous';
import { Maybe } from '../../../shared/domain/types/object';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AUTH_ENTITY_HEADER, CLIENT_ASSIGNER_HEADER } from '../../../shared/domain/constants';
import {
  HttpRequest,
  AuthEntity,
  UnauthorizedException,
  ClientAssigner,
  isAuthEntityClient,
} from '../../../shared';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAnonymous = this.reflector.getAllAndOverride<boolean>(IS_ANONYMOUS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<HttpRequest>();
    const authEntity = this.extractAuthEntity(request);

    if (!authEntity) {
      if (isAnonymous) return true;

      throw new UnauthorizedException();
    }

    const clientAssigner = this.extractClientAssigner(request);
    if (isAuthEntityClient(authEntity) && clientAssigner) {
      authEntity.assigner = clientAssigner;
    }

    request.authEntity = authEntity;
    request.isUnprotected = isAnonymous;

    return true;
  }

  private extractAuthEntity(request: HttpRequest): Maybe<AuthEntity> {
    return this._extractJSONHeaderValue<AuthEntity>(request, AUTH_ENTITY_HEADER);
  }

  private extractClientAssigner(request: HttpRequest): Maybe<ClientAssigner> {
    const clientAssigner = this._extractJSONHeaderValue<ClientAssigner>(
      request,
      CLIENT_ASSIGNER_HEADER
    );

    if (clientAssigner && clientAssigner.at) {
      clientAssigner.at = new Date(clientAssigner.at);
    }

    return clientAssigner;
  }

  private _extractJSONHeaderValue<T>(request: HttpRequest, headerName: string): Maybe<T> {
    const headerValue = request.headers[headerName];
    if (!headerValue) return undefined;

    try {
      const parsedValue = JSON.parse(headerValue as string);
      if (!parsedValue) return undefined;

      return parsedValue;
    } catch (error) {
      return undefined;
    }
  }
}
