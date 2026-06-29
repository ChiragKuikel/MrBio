import { Request } from 'express';
import { TokenHelper } from '@mr-bio/core/shared';
import { AnyObj, Maybe } from '@mr-bio/core/shared';
import { UserAuthConfigService } from '../../../shared/abstractions/user-auth-config-service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  REFRESH_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_HEADER,
  coreErrorMessage,
} from '@mr-bio/core/shared';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private tokenHelper: TokenHelper,
    private configService: UserAuthConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    const decodedToken = this.validateToken(token);

    request['refreshTokenPayload'] = decodedToken;

    return true;
  }

  private extractToken(request: Request): Maybe<string> {
    return this.extractTokenFromHeader(request) ?? this.extractTokenFromCookie(request);
  }

  private extractTokenFromHeader(request: Request): Maybe<string> {
    return request.headers[REFRESH_TOKEN_HEADER] as Maybe<string>;
  }

  private extractTokenFromCookie(request: Request): Maybe<string> {
    return request.cookies[REFRESH_TOKEN_COOKIE_KEY];
  }

  private validateToken(token: Maybe<string>): AnyObj {
    if (!token) {
      throw new UnauthorizedException(coreErrorMessage.REFRESH_TOKEN_REQUIRED);
    }

    // validate token integrity
    const { isValid, decodedToken } = this.tokenHelper.verify<AnyObj>(
      token,
      this.configService.auth.authTokenSecret
    );
    if (!isValid) throw new UnauthorizedException(coreErrorMessage.REFRESH_TOKEN_INVALID);

    return decodedToken;
  }
}
