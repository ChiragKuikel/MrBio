import { Module } from '@nestjs/common';
import { LookupModel } from '../../app';
import { LookupServiceImpl } from '../../app/lookup/domain/lookup-service-impl';
import { LookupService } from '../../app/lookup/domain/abstractions/lookup-service';
import { LookupRepositoryImpl } from '../../app/lookup/repository/lookup-repository-impl';
import { LookupRepository } from '../../app/lookup/repository/abstractions/lookup-repository';
import { LookupPersistenceMapper } from '../../app/lookup/repository/mappers/lookup-persistence-mapper';

@Module({
  providers: [
    {
      provide: LookupService,
      useClass: LookupServiceImpl,
    },
    {
      provide: LookupRepository,
      useClass: LookupRepositoryImpl,
    },
    LookupModel,
    LookupPersistenceMapper,
  ],
  exports: [LookupService],
})
export class LookupModule {}
