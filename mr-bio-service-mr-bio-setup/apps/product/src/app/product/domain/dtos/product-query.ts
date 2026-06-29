import { ApiQuery } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { QueryDoc } from '@mr-bio/core/external-lib';
import { ProductTag } from '../core/entities/product';
import { Status } from '../../../../shared/enum/common';

export function ProductQueryDoc() {
  return applyDecorators(QueryDoc(), UserAdvancedFilterQueryDoc());
}

function UserAdvancedFilterQueryDoc() {
  return applyDecorators(
    ApiQuery({
      name: 'status',
      type: 'string',
      required: false,
      enum: Object.values(Status),
    }),
    ApiQuery({
      name: 'tags',
      type: 'string',
      required: false,
      enum: Object.values(ProductTag),
    }),
    ApiQuery({
      name: 'categoryId',
      type: 'string',
      required: false,
    })
  );
}
