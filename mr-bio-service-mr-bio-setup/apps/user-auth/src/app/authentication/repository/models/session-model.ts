import { Injectable } from '@nestjs/common';
import { SessionSchema } from '../schemas/session-schema';
import { BaseModel, MongoConnection } from '@mr-bio/core/external-lib';
import { dbCollections } from '../../../../external-lib/mongo-db/db-collections';

@Injectable()
export class SessionModel extends BaseModel<SessionSchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.SESSION, {
      useSoftDelete: false,
      uniqueIdentifierField: 'sessionId',
      filterableFields: ['deviceId', 'userId'],
    });
  }
}
