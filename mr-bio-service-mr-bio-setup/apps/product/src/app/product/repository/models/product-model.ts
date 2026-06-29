import { Injectable } from '@nestjs/common';
import { ProductSchema } from '../schemas/product-schema';
import { ProductTag } from '../../domain/core/entities/product';
import { BaseModel, MongoConnection } from '@mr-bio/core/external-lib';
import { dbCollections } from '../../../../external-lib/mongo-db/db-collections';
import {
  AnyObj,
  IQuery,
  MatchType,
  PaginatedQueryParams,
  PaginatedResponse,
  ServiceOption,
} from '@mr-bio/core/shared';

@Injectable()
export class ProductModel extends BaseModel<ProductSchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.PRODUCT, {
      useSoftDelete: true,
      searchableFields: ['status', 'brand', 'name', 'description', 'tags', 'categoryId'],
      filterableFields: ['status', 'brand', 'name', 'description', 'tags', 'categoryId'],
      uniqueIdentifierField: 'productId',
    });
  }

  async findAlByCategoryId(
    categoryId: string,
    query: IQuery,
    option?: ServiceOption
  ): Promise<PaginatedResponse<ProductSchema>> {
    const conditions = { categoryId: { $in: [categoryId] } };

    const rows = (await this.model!.find(conditions ?? {}, option).toArray()) as ProductSchema[];
    const countResponse = await this.model!.countDocuments(conditions ?? {}, option);
    const limit = (query as PaginatedQueryParams)?.limit ?? 10;
    const offset = (query as PaginatedQueryParams)?.page ?? 0;

    return {
      rows,
      metaInfo: {
        totalPage: Math.ceil(countResponse / limit),
        hasNextPage: offset + limit < countResponse,
        hasPreviousPage: offset > 0,
        currentPage: offset,
        totalCount: countResponse,
      } as any,
    };
  }

  async findAllByProductTag(
    tags: ProductTag,
    query: IQuery,
    option?: ServiceOption
  ): Promise<PaginatedResponse<ProductSchema>> {
    const conditions = { tags: { $in: [tags] } };

    const rows = (await this.model!.find(conditions ?? {}, option).toArray()) as ProductSchema[];
    const countResponse = await this.model!.countDocuments(conditions ?? {}, option);
    const limit = (query as PaginatedQueryParams)?.limit ?? 10;
    const offset = (query as PaginatedQueryParams)?.page ?? 0;

    return {
      rows,
      metaInfo: {
        totalPage: Math.ceil(countResponse / limit),
        hasNextPage: offset + limit < countResponse,
        hasPreviousPage: offset > 0,
        currentPage: offset,
        totalCount: countResponse,
      } as any,
    };
  }

  async findAllProduct(
    query: IQuery,
    option?: ServiceOption
  ): Promise<PaginatedResponse<ProductSchema>> {
    let conditions: AnyObj = {};
    if (query.tag != null) {
      conditions = { tags: { $in: [query.tag] } };
    }
    if (query.categoryId != null) {
      conditions = { categoryId: { $in: [query.categoryId] } };
    }
    if (query.status != null) {
      conditions = { status: query.status };
    }

    const rows = (await this.model!.find(conditions ?? {}, option).toArray()) as ProductSchema[];
    const countResponse = await this.model!.countDocuments(conditions ?? {}, option);
    const limit = (query as PaginatedQueryParams)?.limit ?? 10;
    const offset = (query as PaginatedQueryParams)?.page ?? 0;

    return {
      rows,
      metaInfo: {
        totalPage: Math.ceil(countResponse / limit),
        hasNextPage: offset + limit < countResponse,
        hasPreviousPage: offset > 0,
        currentPage: offset,
        totalCount: countResponse,
      } as any,
    };
  }
}
