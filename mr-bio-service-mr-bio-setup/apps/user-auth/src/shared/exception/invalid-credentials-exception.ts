import { UnauthorizedException } from '@nestjs/common';

export class InvalidCredentialException extends UnauthorizedException {
  constructor(message?: string) {
    super(message ?? 'The email or password you have entered is invalid.');
  }
}
