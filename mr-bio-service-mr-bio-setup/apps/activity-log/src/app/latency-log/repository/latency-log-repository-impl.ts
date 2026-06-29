import { Injectable } from '@nestjs/common';
import { IQuery } from '@mr-bio/core/shared';
import { LatencyLogModel } from './models/latency-log-model';
import { BaseRepositoryImpl } from '@mr-bio/core/external-lib';
import { LatencyLogSchema } from './schemas/latency-log-schema';
import { LatencyLog } from '../domain/core/entities/latency-log';
import { LatencyLogRepository } from './abstractions/latency-log-repository';
import { LatencyLogPersistenceMapper } from './mappers/latency-log-persistence-mapper';

@Injectable()
export class LatencyLogRepositoryImpl
  extends BaseRepositoryImpl<LatencyLog, LatencyLogSchema, IQuery>
  implements LatencyLogRepository
{
  constructor(
    protected model: LatencyLogModel,
    protected mapper: LatencyLogPersistenceMapper
  ) {
    super(model, mapper);
  }
}
