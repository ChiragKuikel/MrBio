import { LatencyLog } from '../core/entities/latency-log';
import { BaseService, IQuery } from '@mr-bio/core/shared';
import { CreateLatencyLogDto } from '../dtos/create-latency-log';
import { UpdateLatencyLogDto } from '../dtos/update-latency-log';

export abstract class LatencyLogService extends BaseService<
  LatencyLog,
  CreateLatencyLogDto,
  UpdateLatencyLogDto,
  IQuery
> {}
