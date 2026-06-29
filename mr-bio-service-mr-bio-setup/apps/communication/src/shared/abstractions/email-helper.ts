import { EmailAttachment } from '../../app/domain/core/entities/message-template';

export abstract class EmailHelper {
  abstract send(data: EmailPayload): Promise<string>;
}

export type EmailCommunicator = {
  name?: string;
  email: string;
};

export type EmailPayload = {
  from?: EmailCommunicator;
  to: EmailCommunicator | EmailCommunicator[];
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
};
