import { Injectable } from '@nestjs/common';
import { ExceptionLogSchema } from '../schemas/exception-log-schema';
import { BasePersistenceMapper, withoutAttrs } from '@mr-bio/core/shared';
import { ExceptionLog } from '../../../../app/exception-log/domain/core/entities/exception-log';

@Injectable()
export class ExceptionLogPersistenceMapper extends BasePersistenceMapper<
  ExceptionLog,
  ExceptionLogSchema
> {
  domainToPersistence(domain: ExceptionLog): ExceptionLogSchema {
    return {
      exceptionLogId: domain.id,
      ...withoutAttrs(domain, ['id']),
    };
  }

  persistenceToDomain(persistence: ExceptionLogSchema): ExceptionLog {
    const domain = new ExceptionLog(persistence.exceptionLogId);
    domain.timestamp = persistence.timestamp;
    domain.application = persistence.application;
    domain.environment = persistence.environment;
    domain.level = persistence.level;
    domain.request = persistence.request;
    domain.response = persistence.response;
    domain.user = persistence.user;
    domain.exception = persistence.exception;
    domain.meta = persistence.meta;
    domain.message = persistence.message;

    return domain;
  }
}
