import { CreatedMfa } from '../../abstractions/mfa-service';

export class MfaCreatedEvent {
  constructor(public mfa: CreatedMfa) {}
}
