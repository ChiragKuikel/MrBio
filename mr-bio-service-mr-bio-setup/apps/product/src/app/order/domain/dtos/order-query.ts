import { ApiQuery } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { QueryDoc } from '@mr-bio/core/external-lib';
import { OrderStatus } from '../core/entities/order';

export function OrderQueryDoc() {
  return applyDecorators(QueryDoc(), UserAdvancedFilterQueryDoc());
}

function UserAdvancedFilterQueryDoc() {
  return applyDecorators(
    ApiQuery({
      name: 'userId',
      type: 'string',
      required: false,
    }),
    ApiQuery({
      name: 'status',
      type: 'string',
      required: false,
      enum: Object.values(OrderStatus),
    })
  );
}
