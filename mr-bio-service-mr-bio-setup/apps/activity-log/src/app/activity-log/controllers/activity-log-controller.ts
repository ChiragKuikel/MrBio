import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { ActivityLogQueryDoc } from './docs/activity-log-query';
import { ActivityLogQueryParams } from './validations/activity-log-query';
import { AuthEntityDecorator, Authorize } from '@mr-bio/core/external-lib';
import { ActivityLogService } from '../domain/abstractions/activity-log-service';
import {
  ActivityLog,
  AuthEntity,
  IHttpResponse,
  FindAllResponse,
  ProjectModule,
  buildHttpResponse,
  coreSuccessMessage,
  formatModuleMessage,
} from '@mr-bio/core/shared';

@Controller('activity-logs')
export class ActivityLogController {
  constructor(private activityLogService: ActivityLogService) {}

  @ApiBearerAuth('JWT')
  @ActivityLogQueryDoc()
  @Authorize({
    resourcePermission: { resource: 'ACTIVITY-LOG', permissions: ['ACTIVITY-LOG-READ'] },
  })
  @Get()
  async get(
    @Query() query: ActivityLogQueryParams,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<FindAllResponse<ActivityLog>>> {
    const responseData = await this.activityLogService.get(query, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_FETCH_SUCCESS, ProjectModule.ACTIVITY_LOG)
    );
  }
}
