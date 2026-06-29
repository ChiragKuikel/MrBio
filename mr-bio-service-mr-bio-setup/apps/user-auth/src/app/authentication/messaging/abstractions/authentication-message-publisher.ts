import { MfaCreatedEvent } from '../../domain/core/event/mfa-created';

export abstract class AuthenticationMessagePublisher {
  abstract publishOtpCreatedEvent(event: MfaCreatedEvent): void;
}
