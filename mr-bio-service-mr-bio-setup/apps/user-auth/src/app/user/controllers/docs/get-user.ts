/* eslint-disable perfectionist/sort-objects */
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { userResponseExample, userResponseSchema } from './shared';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
  ProjectModule,
  coreErrorMessage,
  formatModuleMessage,
  getCurrentUTCDate,
} from '@mr-bio/core/shared';

export function GetUserDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get user by ID',
      description: 'This endpoint allows administrators to get a user by ID.',
    }),
    ApiOkResponse({
      description: 'User fetched successfully',
      content: {
        'application/json': {
          example: {
            statusCode: HttpStatus.OK,
            timestamp: getCurrentUTCDate(),
            message: 'User fetched successfully',
            data: userResponseExample,
          },
          schema: userResponseSchema,
        },
      },
    }),
    ApiNotFoundResponse({
      description: formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.USER),
    })
  );
}
