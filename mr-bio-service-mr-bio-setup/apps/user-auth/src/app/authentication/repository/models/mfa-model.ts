import { Injectable } from '@nestjs/common';
import { MfaSchema } from '../schemas/mfa-schema';
import { BaseModel, MongoConnection } from '@mr-bio/core/external-lib';
import { dbCollections } from '../../../../external-lib/mongo-db/db-collections';

@Injectable()
export class MfaModel extends BaseModel<MfaSchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.MFA, {
      useSoftDelete: false,
      uniqueIdentifierField: 'mfaId',
    });
  }
}
