/* eslint-disable perfectionist/sort-objects */
import { getCurrentUTCDate } from '@mr-bio/core/shared';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { loginResponseExample, loginResponseSchema } from './shared';
import { ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function RefreshTokenDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Refresh access token',
      description:
        'This endpoint allows to refresh an access token. The refresh token is taken from either cookie or header.',
    }),
    ApiCreatedResponse({
      description: 'Token refreshed successfully',
      content: {
        'application/json': {
          example: {
            statusCode: HttpStatus.CREATED,
            timestamp: getCurrentUTCDate(),
            message: 'Token refreshed successfully',
            data: loginResponseExample,
          },
          schema: loginResponseSchema,
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Session has expired. Please login again.',
    })
  );
}
