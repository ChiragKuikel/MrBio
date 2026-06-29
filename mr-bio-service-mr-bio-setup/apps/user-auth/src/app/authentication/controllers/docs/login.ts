/* eslint-disable perfectionist/sort-objects */
import { getCurrentUTCDate } from '@mr-bio/core/shared';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { loginResponseExample, loginResponseSchema } from './shared';
import { ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function LoginDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'User login',
      description:
        'This endpoint allows users to given using identifier and password. Identifier may be email or username.',
    }),
    ApiCreatedResponse({
      description: 'Logged in successfully',
      content: {
        'application/json': {
          example: {
            statusCode: HttpStatus.CREATED,
            timestamp: getCurrentUTCDate(),
            message: 'Logged in successfully',
            data: loginResponseExample,
          },
          schema: loginResponseSchema,
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'The email or password you have entered is invalid.',
    })
  );
}
