import { coreErrorMessage } from '../constants';
import { DomainException } from './domain-exception';

export class UnauthorizedException extends DomainException {
  constructor(message?: string, detail?: any) {
    super(message ?? coreErrorMessage.UNAUTHENTICATED_ACCESS, detail);

    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}
