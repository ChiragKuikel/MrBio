/* eslint-disable perfectionist/sort-objects */
import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';
import { ProjectModule, coreErrorMessage, formatModuleMessage } from '@mr-bio/core/shared';

export function ForgotPasswordDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Forgot password',
      description: "This endpoint sends reset password link to the user's email.",
    }),
    ApiCreatedResponse({
      description: 'Reset password link sent successfully',
    }),
    ApiNotFoundResponse({
      description: formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.USER),
    })
  );
}
