/* eslint-disable perfectionist/sort-objects */
import { applyDecorators } from '@nestjs/common';
import { ProjectModule, coreErrorMessage, formatModuleMessage } from '@mr-bio/core/shared';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  // ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ResetPasswordDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Reset password',
      description:
        'This endpoint allows platform administrators to reset password of users to the default password.',
    }),
    ApiOkResponse({
      description: 'Password reset successfully',
    }),
    ApiNotFoundResponse({
      description: formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.USER),
    }),
    ApiUnauthorizedResponse({
      description: 'The link has expired',
    })
  );
}
