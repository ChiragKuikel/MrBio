import { BaseSchema } from '@mr-bio/core/external-lib';
import TriggerPoint from '../../../shared/enums/trigger-point';
import { MessageTemplateCode } from '../../../shared/enums/message-template-code';
import {
  EmailMessage,
  SMSMessage,
  TemplateType,
} from '../../domain/core/entities/message-template';

export interface IMessageTemplate {
  messageTemplateId: string;
  code: MessageTemplateCode;
  name: string;
  description: string;
  messages: [EmailMessage, SMSMessage] | [EmailMessage] | [SMSMessage] | [];
  type: TemplateType;
  triggerPoints: TriggerPoint[];
  variables?: string[];
}

export type MessageTemplateSchema = IMessageTemplate & BaseSchema;
