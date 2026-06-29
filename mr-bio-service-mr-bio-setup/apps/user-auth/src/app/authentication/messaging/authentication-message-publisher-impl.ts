import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MfaAction } from '../domain/core/entities/mfa';
import { MfaCreatedEvent } from '../domain/core/event/mfa-created';
import { EventTopic, OtpGeneratedMessage } from '@mr-bio/core/shared';
import { AuthenticationMessagePublisher } from './abstractions/authentication-message-publisher';

@Injectable()
export class AuthenticationMessagePublisherImpl implements AuthenticationMessagePublisher {
  constructor() {} // @Inject(KAFKA_CLIENT_NAME) private client: ClientKafka

  publishOtpCreatedEvent(event: MfaCreatedEvent): void {
    switch (event.mfa.action) {
      case MfaAction.LOGIN:
        this._handleLoginOtp(event);
        break;

      default:
        return;
    }
  }

  private _handleLoginOtp(event: MfaCreatedEvent): void {
    const mfaUser = event.mfa.user.asAuthenticated;

    const message: OtpGeneratedMessage = {
      otp: event.mfa.code,
      email: mfaUser.email,
      firstName: mfaUser.name.firstName,
      middleName: mfaUser.name.middleName,
      lastName: mfaUser.name.lastName,
    };

    // this.client.emit(EventTopic.LOGIN_OTP_GENERATED, message);
  }
}
