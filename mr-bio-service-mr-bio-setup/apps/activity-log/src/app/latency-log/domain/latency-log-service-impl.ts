import { Injectable } from '@nestjs/common';
import { LatencyLog } from './core/entities/latency-log';
import { CreateLatencyLogDto } from './dtos/create-latency-log';
import { UpdateLatencyLogDto } from './dtos/update-latency-log';
import { LatencyLogService } from './abstractions/latency-log-service';
import { LatencyLogRepository } from '../repository/abstractions/latency-log-repository';
import {
  FindAllResponse,
  NotFoundException,
  ServiceOption,
  coreErrorMessage,
  formatModuleMessage,
  IQuery,
  ProjectModule,
  CountResponse,
  PaginatedResponse,
} from '@mr-bio/core/shared';

@Injectable()
export class LatencyLogServiceImpl implements LatencyLogService {
  constructor(private latencyLogRepository: LatencyLogRepository) {}

  async create(createDto: CreateLatencyLogDto, option: ServiceOption): Promise<LatencyLog> {
    const latencyLog = new LatencyLog();
    latencyLog.initialize(createDto);

    return this.latencyLogRepository.create(latencyLog, option);
  }

  async count(query: IQuery, option?: ServiceOption): Promise<CountResponse> {
    return await this.latencyLogRepository.count(query, option);
  }

  async get(query: IQuery, option: ServiceOption): Promise<PaginatedResponse<LatencyLog>> {
    return await this.latencyLogRepository.findAll(query, option);
  }

  async getOneById(id: string, option?: ServiceOption): Promise<LatencyLog> {
    const latencyLog = await this.latencyLogRepository.findOneById(id, option);
    if (!latencyLog)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.LATENCY_LOG)
      );

    return latencyLog;
  }

  async updateById(
    id: string,
    updateDto: UpdateLatencyLogDto,
    option: ServiceOption
  ): Promise<LatencyLog> {
    const updatedLatencyLog = await this.latencyLogRepository.updateById(id, updateDto, option);
    if (!updatedLatencyLog)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.LATENCY_LOG)
      );

    return updatedLatencyLog;
  }

  async deleteById(id: string, option: ServiceOption): Promise<void> {
    return await this.latencyLogRepository.deleteById(id, option);
  }
}
