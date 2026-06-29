import { Injectable } from '@nestjs/common';
import { BasePersistenceMapper, withoutAttrs } from '@mr-bio/core/shared';
import { MessageTemplateSchema } from '../schemas/message-template-schema';
import { MessageTemplate } from '../../domain/core/entities/message-template';

@Injectable()
export class MessageTemplatePersistenceMapper extends BasePersistenceMapper<
  MessageTemplate,
  MessageTemplateSchema
> {
  domainToPersistence(domain: MessageTemplate): MessageTemplateSchema {
    return {
      messageTemplateId: domain.id,
      ...withoutAttrs(domain, ['id']),
    };
  }

  persistenceToDomain(persistence: MessageTemplateSchema): MessageTemplate {
    const domain = new MessageTemplate(persistence.messageTemplateId);
    domain.name = persistence.name;
    domain.description = persistence.description;
    domain.type = persistence.type;
    domain.code = persistence.code;
    domain.messages = persistence.messages;
    domain.triggerPoints = persistence.triggerPoints;
    domain.variables = persistence.variables;

    domain.created = persistence.created;
    domain.updated = persistence.updated;

    return domain;
  }
}
