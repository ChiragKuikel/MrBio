import { Category } from '../core/entities/category';
import { BaseService, IQuery } from '@mr-bio/core/shared';
import { CreateCategoryDto } from '../dtos/create-category';
import { UpdateCategoryDto } from '../dtos/update-category';

export abstract class CategoryService extends BaseService<
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  IQuery
> {}
