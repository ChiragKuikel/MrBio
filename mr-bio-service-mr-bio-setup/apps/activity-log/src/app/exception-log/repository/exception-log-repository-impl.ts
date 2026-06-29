import { Injectable } from '@nestjs/common';
import { IQuery } from '@mr-bio/core/shared';
import { BaseRepositoryImpl } from '@mr-bio/core/external-lib';
import { ExceptionLogModel } from './models/exception-log-model';
import { ExceptionLogSchema } from './schemas/exception-log-schema';
import { ExceptionLogRepository } from './abstractions/exception-log-repository';
import { ExceptionLogPersistenceMapper } from './mappers/exception-log-persistence-mapper';
import { ExceptionLog } from '../../../app/exception-log/domain/core/entities/exception-log';

@Injectable()
export class ExceptionLogRepositoryImpl
  extends BaseRepositoryImpl<ExceptionLog, ExceptionLogSchema, IQuery>
  implements ExceptionLogRepository
{
  constructor(
    protected model: ExceptionLogModel,
    protected mapper: ExceptionLogPersistenceMapper
  ) {
    super(model, mapper);
  }
}
