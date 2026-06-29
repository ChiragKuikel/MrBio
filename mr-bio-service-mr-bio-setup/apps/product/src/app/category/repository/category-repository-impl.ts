import { Injectable } from '@nestjs/common';
import { CategoryModel } from './models/category-model';
import { CategorySchema } from './schemas/category-schema';
import { Category } from '../domain/core/entities/category';
import { BaseRepositoryImpl } from '@mr-bio/core/external-lib';
import { IQuery, Nullable, ServiceOption } from '@mr-bio/core/shared';
import { CategoryRepository } from './abstractions/category-repository';
import { CategoryPersistenceMapper } from './mappers/category-persistence-mapper';

@Injectable()
export class CategoryRepositoryImpl
  extends BaseRepositoryImpl<Category, CategorySchema, IQuery>
  implements CategoryRepository
{
  constructor(
    protected model: CategoryModel,
    protected mapper: CategoryPersistenceMapper
  ) {
    super(model, mapper);
  }
  async findOneByCode(code: string, option?: ServiceOption): Promise<Nullable<Category>> {
    const category = await this.model.findOne({ code }, option);
    if (!category) return null;

    return this.mapper.persistenceToDomain(category);
  }
}
