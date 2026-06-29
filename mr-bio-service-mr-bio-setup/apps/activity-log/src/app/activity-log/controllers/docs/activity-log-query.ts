import { ApiQuery } from '@nestjs/swagger';
import { LogModule } from '@mr-bio/core/shared';
import { applyDecorators } from '@nestjs/common';
import { QueryDoc } from '@mr-bio/core/external-lib';

export function ActivityLogQueryDoc() {
  return applyDecorators(
    QueryDoc(),
    ApiQuery({
      type: 'string',
      name: 'module',
      required: false,
      enum: <LogModule[]>['DASHBOARD', 'ROLE_PERMISSION', 'USER'],
    }),
    ApiQuery({
      type: 'string',
      required: false,
      name: 'startDate',
      schema: {
        format: 'date-time',
      },
    }),
    ApiQuery({
      type: 'string',
      required: false,
      name: 'endDate',
      schema: {
        format: 'date-time',
      },
    }),
    ApiQuery({
      type: 'string',
      name: 'userId',
      required: false,
    })
  );
}
