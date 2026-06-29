import { BaseRepository, IQuery } from '@mr-bio/core/shared';
import { LatencyLog } from '../../domain/core/entities/latency-log';

export abstract class LatencyLogRepository extends BaseRepository<LatencyLog, IQuery> {}
