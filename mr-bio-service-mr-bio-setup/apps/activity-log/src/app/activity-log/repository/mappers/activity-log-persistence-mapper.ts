import { Injectable } from '@nestjs/common';
import { ActivityLogSchema } from '../schemas/activity-log-schema';
import { ActivityLog } from '../../domain/core/entities/activity-log';
import { ActivityLogQueryOptions } from '../../domain/dtos/activity-log-query';
import {
  BasePersistenceMapper,
  DBQuery,
  withoutAttrs,
  withoutEmptyValues,
} from '@mr-bio/core/shared';

@Injectable()
export class ActivityLogPersistenceMapper extends BasePersistenceMapper<
  ActivityLog,
  ActivityLogSchema,
  ActivityLogQueryOptions
> {
  domainToPersistence(domain: ActivityLog): ActivityLogSchema {
    return {
      activityLogId: domain.id,
      ...withoutAttrs(domain, ['id']),
    };
  }

  persistenceToDomain(persistence: ActivityLogSchema): ActivityLog {
    const domain = new ActivityLog(persistence.activityLogId);
    domain.event = persistence.event;
    domain.log = persistence.log;
    domain.severity = persistence.severity;
    domain.logged = persistence.logged;
    domain.tags = persistence.tags;
    domain.userVisibility = persistence.userVisibility;

    domain.created = persistence.created;
    domain.updated = persistence.updated;

    return domain;
  }

  mapQuery(query: ActivityLogQueryOptions): DBQuery<ActivityLogSchema> {
    return withoutEmptyValues(<DBQuery<ActivityLogSchema>>{
      ...query,
      'logged.id': query.userId,
      'log.module': query.module,
    });
  }
}
