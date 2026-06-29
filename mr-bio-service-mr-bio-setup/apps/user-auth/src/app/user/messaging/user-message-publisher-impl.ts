import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ResetPasswordEvent } from '../domain/core/events/reset-password';
import { UserMessagePublisher } from './abstractions/user-message-publisher';
import { AccountActivationEvent } from '../domain/core/events/account-activation';
import { UserAuthConfigService } from '../../../shared/abstractions/user-auth-config-service';
import {
  EventTopic,
  Logger,
  AccountActivationMessage,
  ResetPasswordMessage,
} from '@mr-bio/core/shared';

@Injectable()
export class UserMessagePublisherImpl implements UserMessagePublisher {
  constructor(
    private logger: Logger,
    private configService: UserAuthConfigService
  ) {}

  publishAccountActivationEvent(event: AccountActivationEvent): void {
    const message: AccountActivationMessage = {
      email: event.user.email,
      firstName: event.user.firstName,
      verificationLink: `${this.configService.serviceUrl.ui}/activate-account?token=${event.mfa.token}`,
    };
  }

  publishResetPasswordEvent(event: ResetPasswordEvent): void {
    const message: ResetPasswordMessage = {
      email: event.user.email,
      firstName: event.user.firstName,
      resetPasswordLink: `${this.configService.serviceUrl.ui}/reset-password?token=${event.mfa.token}`,
    };
  }
}
