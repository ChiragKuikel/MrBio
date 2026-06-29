import { BaseEntity } from '@mr-bio/core/shared';
import TriggerPoint from '../../../../shared/enums/trigger-point';
import { MessageTemplateCode } from '../../../../shared/enums/message-template-code';

export class MessageTemplate extends BaseEntity {
  code: MessageTemplateCode;
  name: string;
  description: string;
  messages: [EmailMessage, SMSMessage] | [EmailMessage] | [SMSMessage] | [];
  type: TemplateType;
  variables?: string[];
  triggerPoints: TriggerPoint[];
}

export enum TemplateType {
  SYSTEM = 'system',
  USER = 'user',
}

export interface BaseMessage {
  body: string;
  subject: string;
  method: MessageMethod;
}

export interface SMSMessage extends BaseMessage {
  method: MessageMethod.SMS;
}

export interface EmailMessage extends BaseMessage {
  method: MessageMethod.EMAIL;
  attachments?: Array<EmailAttachment>;
}

export interface EmailAttachment {
  name: string;
  path: string;
  size?: number;
  'content-type': EmailAttachmentType;
}

export enum EmailAttachmentType {
  PDF = 'pdf',
  EXCEL = 'xslx',
  JPEG = 'jpeg',
  PNG = 'png',
}

export enum MessageMethod {
  EMAIL = 'email',
  SMS = 'sms',
}
