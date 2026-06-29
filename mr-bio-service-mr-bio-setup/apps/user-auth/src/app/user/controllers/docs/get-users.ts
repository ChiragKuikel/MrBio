/* eslint-disable perfectionist/sort-objects */
import { userResponseExample } from './shared';
import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function GetUsersDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get users',
      description: 'This endpoint allows administrators to get users.',
    }),
    ApiOkResponse({
      description: 'Users fetched successfully',
      content: {
        'application/json': {
          example: {
            data: {
              metaInfo: {
                totalPage: 5,
                hasNextPage: true,
                hasPreviousPage: true,
                currentPage: 3,
              },
              rows: [userResponseExample],
            },
            message: 'Users fetched successfully.',
            timestamp: '2024-05-09T08:05:30.170Z',
            statusCode: 200,
          },
          schema: {
            title: 'Paginated User Response',
            properties: {
              metaInfo: {
                properties: {
                  totalPage: {
                    type: 'number',
                  },
                  currentPage: {
                    type: 'number',
                  },
                  hasPreviousPage: {
                    type: 'boolean',
                  },
                  hasNextPage: {
                    type: 'boolean',
                  },
                },
              },
              rows: {
                type: 'User Response array',
              },
            },
          },
        },
      },
    })
  );
}
