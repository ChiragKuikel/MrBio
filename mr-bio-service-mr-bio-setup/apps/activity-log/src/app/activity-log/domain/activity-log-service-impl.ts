import { Injectable } from '@nestjs/common';
import { ActivityLog } from './core/entities/activity-log';
import { CreateActivityLogDto } from './dtos/create-activity-log';
import { ActivityLogQueryOptions } from './dtos/activity-log-query';
import { ServiceOption, FindAllResponse } from '@mr-bio/core/shared';
import { ActivityLogService } from './abstractions/activity-log-service';
import { ActivityLogRepository } from '../repository/abstractions/activity-log-repository';

@Injectable()
export class ActivityLogServiceImpl implements ActivityLogService {
  constructor(private activityLogRepository: ActivityLogRepository) {}

  async create(createDto: CreateActivityLogDto, option?: ServiceOption): Promise<ActivityLog> {
    const activityLog = new ActivityLog();
    activityLog.initialize(createDto);

    return await this.activityLogRepository.create(activityLog, option);
  }

  async get(
    query: ActivityLogQueryOptions,
    option?: ServiceOption
  ): Promise<FindAllResponse<ActivityLog>> {
    return await this.activityLogRepository.findAllVisibleLogs(query, option);
  }
}
