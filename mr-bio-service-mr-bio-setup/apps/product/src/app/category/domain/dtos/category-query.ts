import { applyDecorators } from '@nestjs/common';
import { QueryDoc } from '@mr-bio/core/external-lib';

export function CategoryQueryDoc() {
  return applyDecorators(QueryDoc());
}
