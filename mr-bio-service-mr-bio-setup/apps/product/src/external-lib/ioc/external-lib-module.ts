import { JwtModule } from '@nestjs/jwt';
import { Global, Module } from '@nestjs/common';
import { MongoDbUnitOfWorkImpl, PinoLogger } from '@mr-bio/core/external-lib';
import {
  ActivityLogPublisher,
  ActivityLogPublisherImpl,
  EntityActivityLogPublisherFactory,
  Logger,
  UnitOfWork,
} from '@mr-bio/core/shared';

@Global()
@Module({
  imports: [JwtModule],
  exports: [UnitOfWork, Logger, ActivityLogPublisher, EntityActivityLogPublisherFactory],
  providers: [
    {
      provide: UnitOfWork,
      useClass: MongoDbUnitOfWorkImpl,
    },
    {
      provide: Logger,
      useClass: PinoLogger,
    },
    {
      provide: ActivityLogPublisher,
      useClass: ActivityLogPublisherImpl,
    },
    EntityActivityLogPublisherFactory,
  ],
})
export class ExternalLibModule {}
