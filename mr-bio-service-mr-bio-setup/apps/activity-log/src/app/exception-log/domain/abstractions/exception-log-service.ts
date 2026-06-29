import { ExceptionLog } from '../core/entities/exception-log';
import { CreateExceptionLogDto } from '../dtos/create-exception-log';
import { IQuery, FindAllResponse, ServiceOption } from '@mr-bio/core/shared';

export abstract class ExceptionLogService {
  abstract create(createDto: CreateExceptionLogDto, option?: ServiceOption): Promise<ExceptionLog>;
  abstract get(query: IQuery, option?: ServiceOption): Promise<FindAllResponse<ExceptionLog>>;
}
