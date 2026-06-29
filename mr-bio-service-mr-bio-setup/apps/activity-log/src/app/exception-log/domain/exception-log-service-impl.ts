import { Injectable } from '@nestjs/common';
import { ExceptionLog } from '../domain/core/entities/exception-log';
import { CreateExceptionLogDto } from '../domain/dtos/create-exception-log';
import { ExceptionLogService } from '../domain/abstractions/exception-log-service';
import { ExceptionLogRepository } from '../repository/abstractions/exception-log-repository';
import { IQuery, FindAllResponse, ServiceOption, PaginatedResponse } from '@mr-bio/core/shared';

@Injectable()
export class ExceptionLogServiceImpl implements ExceptionLogService {
  constructor(private readonly exceptionLogRepository: ExceptionLogRepository) {}
  async get(query: IQuery, option?: ServiceOption): Promise<FindAllResponse<ExceptionLog>> {
    return (await this.exceptionLogRepository.findAll(query, option)).rows;
  }

  async create(createDto: CreateExceptionLogDto, option?: ServiceOption): Promise<ExceptionLog> {
    const exceptionLog = new ExceptionLog();
    exceptionLog.initialize(createDto);

    return this.exceptionLogRepository.create(exceptionLog, option);
  }
}
