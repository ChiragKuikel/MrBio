import { Status } from '../../../../shared/enum/common';

export type UpdateCategoryDto = Partial<{
  name: string;
  code: string;
  status: Status;
  description?: string;
}>;
