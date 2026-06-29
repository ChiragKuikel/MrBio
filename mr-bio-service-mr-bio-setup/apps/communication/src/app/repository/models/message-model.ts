import { Injectable } from '@nestjs/common';
import { MessageSchema } from '../schemas/message-schema';
import { BaseModel, MongoConnection } from '@mr-bio/core/external-lib';
import { dbCollections } from '../../../external-lib/mongo-db/db-collections';

@Injectable()
export class MessageModel extends BaseModel<MessageSchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.MESSAGE, {
      useSoftDelete: true,
      uniqueIdentifierField: 'messageId',
      filterableFields: ['messageTemplateId'],
      searchableFields: ['sender.name', 'sender.email', 'receivers.email' as any, 'receivers.name'],
    });
  }
}
