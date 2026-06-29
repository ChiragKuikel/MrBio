import { ActivityLog } from '../../domain/core/entities/activity-log';
import { ActivityLogQueryOptions } from '../../domain/dtos/activity-log-query';
import { BaseRepository, FindAllResponse, ServiceOption } from '@mr-bio/core/shared';

export abstract class ActivityLogRepository extends BaseRepository<
  ActivityLog,
  ActivityLogQueryOptions
> {
  abstract findAllVisibleLogs(
    query: ActivityLogQueryOptions,
    option?: ServiceOption
  ): Promise<FindAllResponse<ActivityLog>>;
}
