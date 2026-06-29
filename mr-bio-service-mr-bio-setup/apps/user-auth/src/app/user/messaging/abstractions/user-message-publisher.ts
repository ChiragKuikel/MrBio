import { ResetPasswordEvent } from '../../domain/core/events/reset-password';
import { AccountActivationEvent } from '../../domain/core/events/account-activation';

export abstract class UserMessagePublisher {
  abstract publishResetPasswordEvent(event: ResetPasswordEvent): void;
  abstract publishAccountActivationEvent(event: AccountActivationEvent): void;
}
