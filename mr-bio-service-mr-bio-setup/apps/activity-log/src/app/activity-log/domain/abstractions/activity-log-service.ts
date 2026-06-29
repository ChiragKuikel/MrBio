import { ActivityLog } from '../core/entities/activity-log';
import { CreateActivityLogDto } from '../dtos/create-activity-log';
import { ActivityLogQueryOptions } from '../dtos/activity-log-query';
import { FindAllResponse, ServiceOption } from '@mr-bio/core/shared';

export abstract class ActivityLogService {
  abstract create(createDto: CreateActivityLogDto, option?: ServiceOption): Promise<ActivityLog>;
  abstract get(
    query: ActivityLogQueryOptions,
    option?: ServiceOption
  ): Promise<FindAllResponse<ActivityLog>>;
}
