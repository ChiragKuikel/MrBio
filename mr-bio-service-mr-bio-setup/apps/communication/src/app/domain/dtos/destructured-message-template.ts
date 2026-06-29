import { EmailMessage, MessageTemplate, SMSMessage } from '../core/entities/message-template';

export type DestructuredMessageTemplate = Omit<MessageTemplate, 'messages'> & {
  message: EmailMessage | SMSMessage;
};
