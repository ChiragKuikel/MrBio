import { ApiQuery } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { UserStatus } from '../../domain/core/entities/user';
import { CountQueryDoc, QueryDoc, QueryMatchTypeDoc } from '@mr-bio/core/external-lib';

export function UserQueryDoc() {
  return applyDecorators(QueryDoc(), QueryMatchTypeDoc(), UserAdvancedFilterQueryDoc());
}

export function UserCountQueryDoc() {
  return applyDecorators(CountQueryDoc(), QueryMatchTypeDoc(), UserAdvancedFilterQueryDoc());
}

function UserAdvancedFilterQueryDoc() {
  return applyDecorators(
    ApiQuery({
      type: 'string',
      required: false,
      name: 'firstName',
    }),
    ApiQuery({
      type: 'string',
      required: false,
      name: 'lastName',
    }),
    ApiQuery({
      name: 'email',
      type: 'string',
      required: false,
    }),
    ApiQuery({
      name: 'phone',
      type: 'string',
      required: false,
    }),
    ApiQuery({
      name: 'role',
      type: 'string',
      required: false,
    }),
    ApiQuery({
      name: 'status',
      type: 'string',
      required: false,
      enum: Object.values(UserStatus),
    })
  );
}
