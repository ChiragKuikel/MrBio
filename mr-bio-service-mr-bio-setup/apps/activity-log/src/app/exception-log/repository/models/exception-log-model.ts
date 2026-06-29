import { Injectable } from '@nestjs/common';
import { BaseModel, MongoConnection } from '@mr-bio/core/external-lib';
import { dbCollections } from '../../../../external-lib/mongo-db/db-collections';
import { ExceptionLogSchema } from '../../repository/schemas/exception-log-schema';

@Injectable()
export class ExceptionLogModel extends BaseModel<ExceptionLogSchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.EXCEPTION_LOG, {
      indexingFields: [],
      useSoftDelete: true,
      filterableFields: [],
      searchableFields: [],
      uniqueIdentifierField: 'exceptionLogId',
    });
  }
}
