/* eslint-disable perfectionist/sort-objects */
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ChangePasswordDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Change password',
      description: 'This endpoint allows users to change their password.',
    }),
    ApiOkResponse({
      description: 'Password changed successfully',
    }),
    ApiUnauthorizedResponse({
      description: 'Current password does not match',
    }),
    ApiBadRequestResponse({
      description: 'You cannot use your previous passwords as the new password.',
    })
  );
}
