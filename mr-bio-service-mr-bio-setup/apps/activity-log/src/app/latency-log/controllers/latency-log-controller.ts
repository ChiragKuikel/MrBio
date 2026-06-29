import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { AuthEntityDecorator } from '@mr-bio/core/external-lib';
import { LatencyLog } from '../domain/core/entities/latency-log';
import { LatencyLogService } from '../domain/abstractions/latency-log-service';
import {
  AuthEntity,
  IHttpResponse,
  FindAllResponse,
  IQuery,
  buildHttpResponse,
  coreSuccessMessage,
  formatModuleMessage,
  ProjectModule,
  PaginatedResponse,
} from '@mr-bio/core/shared';

@ApiTags(ProjectModule.LATENCY_LOG)
@Controller('latency-logs')
export class LatencyLogController {
  constructor(private latencyLogService: LatencyLogService) {}
  @Get()
  async get(
    @Query() query: IQuery,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<PaginatedResponse<LatencyLog>>> {
    const responseData = await this.latencyLogService.get(query, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_FETCH_SUCCESS, ProjectModule.LATENCY_LOG)
    );
  }
}
