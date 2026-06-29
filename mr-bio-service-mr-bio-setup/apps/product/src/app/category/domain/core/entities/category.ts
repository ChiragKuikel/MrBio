import { BaseEntity } from '@mr-bio/core/shared';
import { Status } from '../../../../../shared/enum/common';

export class Category extends BaseEntity {
  name: string;
  code: string;
  status: Status;
  description?: string;

  initialize(builder: { name: string; code: string; status: Status; description?: string }) {
    this.name = builder.name;
    this.code = builder.code;
    this.status = builder.status;
    this.description = builder.description;
  }

  findCategoryCode(code: string): Category | null {
    return this.code === code ? this : null;
  }
}
