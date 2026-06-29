import { BaseSchema } from '@mr-bio/core/external-lib';

export interface ICategory {
  categoryId: string;
  name: string;
  code: string;
  status: string;
  description?: string;
}

export type CategorySchema = ICategory & BaseSchema;
