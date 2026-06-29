import { BaseEntity } from '@mr-bio/core/shared';
import { EmailMessage, SMSMessage } from './message-template';
import { MessageStatus } from '../../../../shared/enums/message-status';

export type MessageSender = {
  name?: string;
  email: string;
};

export type MessageReceiver = {
  name?: string;
  email?: string;
  phone?: string;
  deviceToken?: string;
};

export class Message extends BaseEntity {
  messageTemplateId: string;
  refId?: string;
  sender?: MessageSender;
  receivers: MessageReceiver[];
  messageContent: SMSMessage | EmailMessage;
  status: MessageStatus;

  initialize(builder: {
    messageTemplateId: string;
    sender?: MessageSender;
    receivers: MessageReceiver[];
    messageContent: SMSMessage | EmailMessage;
  }) {
    this.messageTemplateId = builder.messageTemplateId;
    this.sender = builder.sender;
    this.receivers = builder.receivers;
    this.messageContent = builder.messageContent;
    this.status = MessageStatus.IN_PROGRESS;
  }
}
