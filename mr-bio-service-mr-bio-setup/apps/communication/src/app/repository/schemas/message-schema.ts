import { BaseSchema } from '@mr-bio/core/external-lib';
import { MessageStatus } from '../../../shared/enums/message-status';
import { MessageReceiver, MessageSender } from '../../domain/core/entities/message';
import { EmailMessage, SMSMessage } from '../../domain/core/entities/message-template';

export interface IMessage {
  messageId: string;
  messageTemplateId: string;
  refId?: string;
  sender?: MessageSender;
  receivers: MessageReceiver[];
  messageContent: SMSMessage | EmailMessage;
  status: MessageStatus;
}

export type MessageSchema = IMessage & BaseSchema;
