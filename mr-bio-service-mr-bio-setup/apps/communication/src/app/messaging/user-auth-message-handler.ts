import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MessageService } from '../domain/abstractions/message-service';
import { eventTopicTriggerPointsMap } from '../../shared/constants/eventTopicTriggerPointsMap';
import {
  AccountActivationMessage,
  EventTopic,
  Logger,
  OtpGeneratedMessage,
  ResetPasswordMessage,
} from '@mr-bio/core/shared';

@Controller()
export class UserAuthMessageHandler {
  constructor(
    private messageService: MessageService,
    private logger: Logger
  ) {}

  @EventPattern(EventTopic.ACCOUNT_ACTIVATION)
  async handleAccountActivation(@Payload() message: AccountActivationMessage) {
    this.logger.debug(`Message received for ${EventTopic.ACCOUNT_ACTIVATION}`, message);
    const triggerPoints = eventTopicTriggerPointsMap[EventTopic.ACCOUNT_ACTIVATION]!;
    await this.messageService.sendMessagesByTriggerPoints(triggerPoints, {
      payload: message,
      saveMessage: true,
      receivers: [{ email: message.email }],
    });
  }

  @EventPattern(EventTopic.LOGIN_OTP_GENERATED)
  async handleLoginOtpGenerated(@Payload() message: OtpGeneratedMessage) {
    this.logger.debug(`Message received for ${EventTopic.LOGIN_OTP_GENERATED}`, message);
    const triggerPoints = eventTopicTriggerPointsMap[EventTopic.LOGIN_OTP_GENERATED]!;
    await this.messageService.sendMessagesByTriggerPoints(triggerPoints, {
      payload: message,
      receivers: [{ email: message.email }],
    });
  }

  @EventPattern(EventTopic.RESET_PASSWORD)
  async handleResetPassword(@Payload() message: ResetPasswordMessage) {
    this.logger.debug(`Message received for ${EventTopic.RESET_PASSWORD}`, message);
    const triggerPoints = eventTopicTriggerPointsMap[EventTopic.RESET_PASSWORD]!;
    await this.messageService.sendMessagesByTriggerPoints(triggerPoints, {
      payload: message,
      receivers: [{ email: message.email }],
    });
  }
}
