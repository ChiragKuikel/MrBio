import { Module } from '@nestjs/common';
import { ExceptionLogModel } from '../../app/exception-log/repository/models/exception-log-model';
import { ExceptionLogServiceImpl } from '../../app/exception-log/domain/exception-log-service-impl';
import { ExceptionLogController } from '../../app/exception-log/controllers/exception-log-controller';
import { ExceptionLogService } from '../../app/exception-log/domain/abstractions/exception-log-service';
import { ExceptionLogMessageHandler } from '../../app/exception-log/messaging/exception-log-message-handler';
import { ExceptionLogRepositoryImpl } from '../../app/exception-log/repository/exception-log-repository-impl';
import { ExceptionLogRepository } from '../../app/exception-log/repository/abstractions/exception-log-repository';
import { ExceptionLogPersistenceMapper } from '../../app/exception-log/repository/mappers/exception-log-persistence-mapper';

@Module({
  controllers: [ExceptionLogMessageHandler, ExceptionLogController],
  providers: [
    {
      provide: ExceptionLogService,
      useClass: ExceptionLogServiceImpl,
    },
    {
      provide: ExceptionLogRepository,
      useClass: ExceptionLogRepositoryImpl,
    },
    ExceptionLogModel,
    ExceptionLogPersistenceMapper,
  ],
})
export class ExceptionLogModule {}
