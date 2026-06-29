import { ApiQuery } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { QueryDoc, QueryMatchTypeDoc } from '@mr-bio/core/external-lib';

export function ResourceQueryDoc() {
  return applyDecorators(
    QueryDoc(),
    QueryMatchTypeDoc(),
    ApiQuery({
      name: 'name',
      type: 'string',
      required: false,
    }),
    ApiQuery({
      name: 'code',
      type: 'string',
      required: false,
    })
  );
}
