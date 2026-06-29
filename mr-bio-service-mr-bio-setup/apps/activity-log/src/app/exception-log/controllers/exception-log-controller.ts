import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExceptionLog } from '../domain/core/entities/exception-log';
import { AuthEntityDecorator, Authorize } from '@mr-bio/core/external-lib';
import { ExceptionLogService } from '../domain/abstractions/exception-log-service';
import {
  AuthEntity,
  IHttpResponse,
  FindAllResponse,
  IQuery,
  buildHttpResponse,
  coreSuccessMessage,
  formatModuleMessage,
  ProjectModule,
} from '@mr-bio/core/shared';

@ApiTags('ExceptionLog')
@Controller('exception-logs')
export class ExceptionLogController {
  constructor(private exceptionLogService: ExceptionLogService) {}

  @ApiBearerAuth('JWT')
  @Authorize({
    resourcePermission: {
      resource: 'EXCEPTION-LOG-MANAGEMENT',
      permissions: ['EXCEPTION-LOG-MANAGEMENT-READ'],
    },
  })
  @Get()
  async get(
    @Query() query: IQuery,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<FindAllResponse<ExceptionLog>>> {
    const responseData = await this.exceptionLogService.get(query, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_FETCH_SUCCESS, ProjectModule.EXCEPTION_LOG)
    );
  }
}
