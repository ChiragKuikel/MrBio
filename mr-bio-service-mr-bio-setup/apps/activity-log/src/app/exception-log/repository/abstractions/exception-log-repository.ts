import { BaseRepository, IQuery } from '@mr-bio/core/shared';
import { ExceptionLog } from '../../domain/core/entities/exception-log';

export abstract class ExceptionLogRepository extends BaseRepository<ExceptionLog, IQuery> {}
