import { Module } from '@nestjs/common';
import { ActivityLogModel } from '../../app/activity-log/repository/models/activity-log-model';
import { ActivityLogServiceImpl } from '../../app/activity-log/domain/activity-log-service-impl';
import { ActivityLogController } from '../../app/activity-log/controllers/activity-log-controller';
import { ActivityLogService } from '../../app/activity-log/domain/abstractions/activity-log-service';
import { ActivityLogMessageHandler } from '../../app/activity-log/messaging/activity-log-message-handler';
import { ActivityLogRepositoryImpl } from '../../app/activity-log/repository/activity-log-repository-impl';
import { ActivityLogRepository } from '../../app/activity-log/repository/abstractions/activity-log-repository';
import { ActivityLogPersistenceMapper } from '../../app/activity-log/repository/mappers/activity-log-persistence-mapper';

@Module({
  controllers: [ActivityLogMessageHandler, ActivityLogController],
  providers: [
    {
      provide: ActivityLogService,
      useClass: ActivityLogServiceImpl,
    },
    {
      provide: ActivityLogRepository,
      useClass: ActivityLogRepositoryImpl,
    },
    ActivityLogModel,
    ActivityLogPersistenceMapper,
  ],
})
export class ActivityLogModule {}
