import { Injectable } from '@nestjs/common';
import { CategorySchema } from '../schemas/category-schema';
import { BaseModel, MongoConnection } from '@mr-bio/core/external-lib';
import { dbCollections } from '../../../../external-lib/mongo-db/db-collections';

@Injectable()
export class CategoryModel extends BaseModel<CategorySchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.CATEGORY, {
      useSoftDelete: true,
      searchableFields: ['code', 'name'],
      filterableFields: ['code', 'name'],
      uniqueIdentifierField: 'categoryId',
    });
  }
}
