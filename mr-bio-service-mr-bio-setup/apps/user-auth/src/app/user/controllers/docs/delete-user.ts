/* eslint-disable perfectionist/sort-objects */
import { applyDecorators } from '@nestjs/common';
import { ProjectModule, coreErrorMessage, formatModuleMessage } from '@mr-bio/core/shared';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function DeleteUserDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete user by ID',
      description: 'This endpoint allows administrators to delete a user by ID.',
    }),
    ApiOkResponse({
      description: 'User deleted successfully',
    }),
    ApiNotFoundResponse({
      description: formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.USER),
    }),
    ApiUnauthorizedResponse({
      description: coreErrorMessage.UNAUTHORIZED_ACCESS,
    })
  );
}
