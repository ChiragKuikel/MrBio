import { Injectable } from '@nestjs/common';
import { LoggedInDto } from '../domain/dtos/logged-in';
import { LoginResponse } from './response/login-response';
import { AuthenticationPresenter } from './abstractions/authentication-presenter';

@Injectable()
export class DefaultAuthenticationPresenter implements AuthenticationPresenter {
  dtoToResponse(dto: LoggedInDto): LoginResponse {
    return {
      user: dto.user,
    };
  }
}
