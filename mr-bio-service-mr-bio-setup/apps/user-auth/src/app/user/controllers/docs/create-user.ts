/* eslint-disable perfectionist/sort-objects */
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { userResponseExample, userResponseSchema } from './shared';
import { coreErrorMessage, getCurrentUTCDate } from '@mr-bio/core/shared';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function CreateUserDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create user',
      description:
        'This endpoint allows administrators to create a new user with a default password.',
    }),
    ApiCreatedResponse({
      description: 'User created successfully',
      content: {
        'application/json': {
          example: {
            statusCode: HttpStatus.CREATED,
            timestamp: getCurrentUTCDate(),
            message: 'User created successfully',
            data: userResponseExample,
          },
          schema: userResponseSchema,
        },
      },
    }),
    ApiConflictResponse({
      description: 'User with email already exists',
    }),
    ApiUnauthorizedResponse({
      description: coreErrorMessage.UNAUTHORIZED_ACCESS,
    })
  );
}
