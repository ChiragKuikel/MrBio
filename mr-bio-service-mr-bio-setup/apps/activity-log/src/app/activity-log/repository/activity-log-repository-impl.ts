import { Injectable } from '@nestjs/common';
import { ActivityLogModel } from './models/activity-log-model';
import { BaseRepositoryImpl } from '@mr-bio/core/external-lib';
import { ActivityLogSchema } from './schemas/activity-log-schema';
import { ActivityLog } from '../domain/core/entities/activity-log';
import { ServiceOption, FindAllResponse } from '@mr-bio/core/shared';
import { ActivityLogQueryOptions } from '../domain/dtos/activity-log-query';
import { ActivityLogRepository } from './abstractions/activity-log-repository';
import { ActivityLogPersistenceMapper } from './mappers/activity-log-persistence-mapper';

@Injectable()
export class ActivityLogRepositoryImpl
  extends BaseRepositoryImpl<ActivityLog, ActivityLogSchema, ActivityLogQueryOptions>
  implements ActivityLogRepository
{
  constructor(
    protected model: ActivityLogModel,
    protected mapper: ActivityLogPersistenceMapper
  ) {
    super(model, mapper);
  }
  findAllVisibleLogs(
    query: ActivityLogQueryOptions,
    option?: ServiceOption
  ): Promise<FindAllResponse<ActivityLog>> {
    return this.model.findAllVisibleLogs(this.mapper.mapQuery(query), option);
  }
}
