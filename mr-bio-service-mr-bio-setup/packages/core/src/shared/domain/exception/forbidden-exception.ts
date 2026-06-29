import { coreErrorMessage } from '../constants';
import { DomainException } from './domain-exception';

export class ForbiddenException extends DomainException {
  constructor(message?: string, detail?: any) {
    super(message ?? coreErrorMessage.UNAUTHORIZED_ACCESS, detail);

    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }
}
