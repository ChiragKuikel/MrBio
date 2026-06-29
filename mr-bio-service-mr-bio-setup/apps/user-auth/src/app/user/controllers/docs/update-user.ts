/* eslint-disable perfectionist/sort-objects */
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { userResponseExample, userResponseSchema } from './shared';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ProjectModule,
  coreErrorMessage,
  formatModuleMessage,
  getCurrentUTCDate,
} from '@mr-bio/core/shared';

export function UpdateUserDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update user by ID',
      description: 'This endpoint allows administrators to update a user by ID.',
    }),
    ApiOkResponse({
      description: 'User updated successfully',
      content: {
        'application/json': {
          example: {
            statusCode: HttpStatus.OK,
            timestamp: getCurrentUTCDate(),
            message: 'User updated successfully',
            data: userResponseExample,
          },
          schema: userResponseSchema,
        },
      },
    }),
    ApiNotFoundResponse({
      description: formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.USER),
    }),
    ApiUnauthorizedResponse({
      description: coreErrorMessage.UNAUTHORIZED_ACCESS,
    })
  );
}
