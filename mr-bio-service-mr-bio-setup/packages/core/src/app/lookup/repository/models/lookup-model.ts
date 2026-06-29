import { Injectable } from '@nestjs/common';
import { MongoConnection } from '../../../..';
import { LookupSchema } from '../schemas/lookup-schema';
import { BaseModel } from '../../../../external-lib/mongo-db/base/base-model';
import { dbCollections } from '../../../../external-lib/mongo-db/db-collections';
@Injectable()
export class LookupModel extends BaseModel<LookupSchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.LOOKUP, {
      useSoftDelete: true,
      searchableFields: ['code'],
      filterableFields: ['code'],
      uniqueIdentifierField: 'lookupId',
      uniqueFields: ['code'],
    });
  }
}
