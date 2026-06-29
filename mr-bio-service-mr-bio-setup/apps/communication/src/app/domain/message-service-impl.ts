import path from 'path';
import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { Message } from './core/entities/message';
import { SendMessageDto } from './dtos/send-message';
import TriggerPoint from '../../shared/enums/trigger-point';
import { MessageService } from './abstractions/message-service';
import { SmsHelper } from '../../shared/abstractions/sms-helper';
import { MessageStatus } from '../../shared/enums/message-status';
import { EmailHelper } from '../../shared/abstractions/email-helper';
import { BaseMessage, MessageMethod } from './core/entities/message-template';
import { MessageRepository } from '../repository/abstractions/message-repository';
import { DestructuredMessageTemplate } from './dtos/destructured-message-template';
import { MessageTemplateRepository } from '../repository/abstractions/message-template-repository';
import {
  AnyObj,
  BaseConfigService,
  Environment,
  Logger,
  Maybe,
  NotFoundException,
  Nullable,
  ServiceOption,
  coreErrorMessage,
  formatModuleMessage,
  getCurrentUTCDate,
  replaceDynamicVariables,
} from '@mr-bio/core/shared';

@Injectable()
export class MessageServiceImpl implements MessageService {
  constructor(
    private messageRepository: MessageRepository,
    private messageTemplateRepository: MessageTemplateRepository,
    private emailHelper: EmailHelper,
    private smsHelper: SmsHelper,
    private logger: Logger,
    private configService: BaseConfigService
  ) {}

  async sendMessagesByTriggerPoints(
    triggerPoints: TriggerPoint[],
    sendMessageDto: SendMessageDto,
    option?: ServiceOption
  ): Promise<void> {
    const messageTemplates = await this.messageTemplateRepository.findDestructuredByTriggerPoints(
      triggerPoints,
      option
    );

    for (const messageTemplate of messageTemplates) {
      const builtMessage = this._buildMessage(messageTemplate.message, sendMessageDto.payload);

      messageTemplate.message.body = builtMessage.body;
      messageTemplate.message.subject = builtMessage.subject;

      await this._sendMessage(sendMessageDto, messageTemplate, option);
    }
  }

  private _buildMessage(message: BaseMessage, payload: AnyObj): BaseMessage {
    const defaultEmailTemplate = this._getDefaultEmailTemplate();

    let subject = replaceDynamicVariables(message.subject, payload);
    const isProd = this.configService.app.env === Environment.PROD;
    if (!isProd) {
      subject = `${subject} - ${this.configService.app.env}`;
    }

    let body = replaceDynamicVariables(message.body, payload);

    if (message.method === MessageMethod.EMAIL) {
      body = replaceDynamicVariables(defaultEmailTemplate, {
        bodyContent: body,
        env: isProd ? '' : this.configService.app.env,
        currentYear: getCurrentUTCDate().getFullYear(),
      });
    }

    return {
      body,
      subject,
      method: message.method,
    };
  }

  private _getDefaultEmailTemplate(): string {
    const templatePath = path.join(__dirname, '../../shared/template/email/default.html');
    if (!existsSync(templatePath)) {
      throw new NotFoundException(
        coreErrorMessage.DEFAULT_ERROR,
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, 'Default template')
      );
    }

    return readFileSync(templatePath, { encoding: 'utf-8' });
  }

  private async _sendMessage(
    sendMessageDto: SendMessageDto,
    populatedMessageTemplate: DestructuredMessageTemplate,
    option?: ServiceOption
  ) {
    const savedMessage = await this._handleMessageSave(
      sendMessageDto,
      populatedMessageTemplate,
      option
    );
    const populatedMessage = populatedMessageTemplate.message;

    const emailReceivers = sendMessageDto.receivers
      .filter(r => !!r.email)
      .map(r => ({ name: r.name, email: r.email as string }));
    const smsReceivers = sendMessageDto.receivers.map(r => r.phone).filter(r => !!r) as string[];

    let refId: Maybe<string>;

    try {
      if (populatedMessage.method === MessageMethod.EMAIL) {
        refId = await this.emailHelper.send({
          to: emailReceivers,
          html: populatedMessage.body,
          subject: populatedMessage.subject,
          attachments: populatedMessage.attachments,
        });
      }

      if (populatedMessage.method === MessageMethod.SMS) {
        refId = await this.smsHelper.send({
          receiver: smsReceivers,
          content: populatedMessage.body,
          title: populatedMessage.subject,
        });
      }

      this.logger.debug(`Message sent successfully.`, {
        receivers: emailReceivers,
        method: populatedMessage.method,
        subject: populatedMessage.subject,
      });

      await this._onSuccessfulMessage(
        {
          refId,
          savedMessageId: savedMessage?.id,
        },
        option
      );
    } catch (err) {
      this.logger.error(`Failed to send message.`, {
        error: err,
        receivers: emailReceivers,
        method: populatedMessage.method,
        subject: populatedMessage.subject,
      });

      await this._onFailedMessage({ messageId: savedMessage?.id }, option);
    }
  }

  private async _handleMessageSave(
    sendMessageDto: SendMessageDto,
    populatedMessageTemplate: DestructuredMessageTemplate,
    option?: ServiceOption
  ): Promise<Nullable<Message>> {
    if (sendMessageDto.saveMessage) {
      const message = new Message();
      message.initialize({
        sender: sendMessageDto.sender,
        receivers: sendMessageDto.receivers,
        messageTemplateId: populatedMessageTemplate.id,
        messageContent: populatedMessageTemplate.message,
      });

      return await this.messageRepository.create(message, option);
    }

    return null;
  }

  private async _onSuccessfulMessage(
    payload: {
      savedMessageId?: string;
      refId?: string;
    },
    option?: ServiceOption
  ) {
    if (payload.savedMessageId) {
      await this.messageRepository.updateById(
        payload.savedMessageId,
        {
          refId: payload.refId,
          status: MessageStatus.SENT,
        },
        option
      );
    }
  }

  private async _onFailedMessage(payload: { messageId?: string }, option?: ServiceOption) {
    if (payload.messageId) {
      await this.messageRepository.updateById(
        payload.messageId,
        {
          status: MessageStatus.FAILED,
        },
        option
      );
    }
  }
}
