/* eslint-disable perfectionist/sort-objects */
import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ProjectModule, coreErrorMessage, formatModuleMessage } from '@mr-bio/core/shared';

export function LogoutDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'User logout',
      description: 'This endpoint allows users to log out.',
    }),
    ApiOkResponse({
      description: 'Logged out successfully',
    }),
    ApiNotFoundResponse({
      description: formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.USER),
    })
  );
}
