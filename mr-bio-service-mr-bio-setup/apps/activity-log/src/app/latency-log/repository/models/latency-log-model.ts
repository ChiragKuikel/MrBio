import { Injectable } from '@nestjs/common';
import { LatencyLogSchema } from '../schemas/latency-log-schema';
import { BaseModel, MongoConnection } from '@mr-bio/core/external-lib';
import { dbCollections } from '../../../../external-lib/mongo-db/db-collections';

@Injectable()
export class LatencyLogModel extends BaseModel<LatencyLogSchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.LATENCY_LOG, {
      useSoftDelete: true,
      searchableFields: [],
      filterableFields: [],
      uniqueIdentifierField: 'latencyLogId',
    });
  }
}
