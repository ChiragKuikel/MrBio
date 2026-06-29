import { Injectable } from '@nestjs/common';
import { MessageSchema } from '../schemas/message-schema';
import { Message } from '../../domain/core/entities/message';
import { BasePersistenceMapper, withoutAttrs } from '@mr-bio/core/shared';

@Injectable()
export class MessagePersistenceMapper extends BasePersistenceMapper<Message, MessageSchema> {
  domainToPersistence(domain: Message): MessageSchema {
    return {
      messageId: domain.id,
      ...withoutAttrs(domain, ['id']),
    };
  }

  persistenceToDomain(persistence: MessageSchema): Message {
    const domain = new Message(persistence.messageId);

    domain.messageTemplateId = persistence.messageTemplateId;
    domain.sender = persistence.sender;
    domain.receivers = persistence.receivers;
    domain.messageContent = persistence.messageContent;
    domain.status = persistence.status;
    domain.refId = persistence.refId;

    domain.created = persistence.created;
    domain.updated = persistence.updated;

    return domain;
  }
}
