import { LoggedInDto } from '../../domain/dtos/logged-in';
import { LoginResponse } from '../response/login-response';

export abstract class AuthenticationPresenter {
  abstract dtoToResponse(dto: LoggedInDto): LoginResponse;
}
