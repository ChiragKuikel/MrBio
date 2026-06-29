import { Injectable } from '@nestjs/common';
import { MessageModel } from './models/message-model';
import { MessageSchema } from './schemas/message-schema';
import { Message } from '../domain/core/entities/message';
import { BaseRepositoryImpl } from '@mr-bio/core/external-lib';
import { MessageRepository } from './abstractions/message-repository';
import { MessagePersistenceMapper } from './mappers/message-persistence-mapper';

@Injectable()
export class MessageRepositoryImpl
  extends BaseRepositoryImpl<Message, MessageSchema>
  implements MessageRepository
{
  constructor(
    protected model: MessageModel,
    protected mapper: MessagePersistenceMapper
  ) {
    super(model, mapper);
  }
}
