import { Status } from '../../../../shared/enum/common';

export type CreateCategoryDto = {
  name: string;
  code: string;
  status: Status;
  description?: string;
};
