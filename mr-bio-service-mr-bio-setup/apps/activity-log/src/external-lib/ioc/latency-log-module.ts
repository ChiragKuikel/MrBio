import { Module } from '@nestjs/common';
import { LatencyLogModel } from '../../app/latency-log/repository/models/latency-log-model';
import { LatencyLogServiceImpl } from '../../app/latency-log/domain/latency-log-service-impl';
import { LatencyLogController } from '../../app/latency-log/controllers/latency-log-controller';
import { LatencyLogService } from '../../app/latency-log/domain/abstractions/latency-log-service';
import { LatencyLogMessageHandler } from '../../app/latency-log/messaging/latency-log-message-handler';
import { LatencyLogRepositoryImpl } from '../../app/latency-log/repository/latency-log-repository-impl';
import { LatencyLogRepository } from '../../app/latency-log/repository/abstractions/latency-log-repository';
import { LatencyLogPersistenceMapper } from '../../app/latency-log/repository/mappers/latency-log-persistence-mapper';
@Module({
  controllers: [LatencyLogMessageHandler, LatencyLogController],
  providers: [
    {
      provide: LatencyLogService,
      useClass: LatencyLogServiceImpl,
    },
    {
      provide: LatencyLogRepository,
      useClass: LatencyLogRepositoryImpl,
    },
    LatencyLogModel,
    LatencyLogPersistenceMapper,
  ],
})
export class LatencyLogModule {}
