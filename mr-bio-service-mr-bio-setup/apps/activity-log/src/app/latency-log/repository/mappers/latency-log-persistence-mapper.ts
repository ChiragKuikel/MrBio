import { Injectable } from '@nestjs/common';
import { LatencyLogSchema } from '../schemas/latency-log-schema';
import { LatencyLog } from '../../domain/core/entities/latency-log';
import { BasePersistenceMapper, withoutAttrs } from '@mr-bio/core/shared';

@Injectable()
export class LatencyLogPersistenceMapper extends BasePersistenceMapper<
  LatencyLog,
  LatencyLogSchema
> {
  domainToPersistence(domain: LatencyLog): LatencyLogSchema {
    return {
      latencyLogId: domain.id,
      ...withoutAttrs(domain, ['id']),
    };
  }

  persistenceToDomain(persistence: LatencyLogSchema): LatencyLog {
    const domain = new LatencyLog(persistence.latencyLogId);
    domain.timestamp = persistence.timestamp;
    domain.endpoint = persistence.endpoint;
    domain.method = persistence.method;
    domain.responseTimeMs = persistence.responseTimeMs;
    domain.statusCode = persistence.statusCode;
    domain.application = persistence.application;
    domain.request = persistence.request;
    domain.user = persistence.user;
    domain.meta = persistence.meta;

    return domain;
  }
}
