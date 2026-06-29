import { Injectable } from '@nestjs/common';
import { ProductModel } from './models/product-model';
import { ProductSchema } from './schemas/product-schema';
import { BaseRepositoryImpl } from '@mr-bio/core/external-lib';
import { Product, ProductTag } from '../domain/core/entities/product';
import { ProductRepository } from './abstractions/product-repository';
import { IQuery, PaginatedResponse, ServiceOption } from '@mr-bio/core/shared';
import { ProductPersistenceMapper } from './mappers/product-persistence-mapper';

@Injectable()
export class ProductRepositoryImpl
  extends BaseRepositoryImpl<Product, ProductSchema, IQuery>
  implements ProductRepository
{
  constructor(
    protected model: ProductModel,
    protected mapper: ProductPersistenceMapper
  ) {
    super(model, mapper);
  }
  async findAllProduct(query: IQuery, option?: ServiceOption): Promise<PaginatedResponse<Product>> {
    const data = await this.model.findAllProduct(query, option);

    const adoptRows = data.rows.map(r => this.mapper.persistenceToDomain(r));

    return {
      rows: adoptRows,
      metaInfo: data.metaInfo,
    };
  }
  async findAllByCategoryId(
    categoryId: string,
    query: IQuery,
    option?: ServiceOption
  ): Promise<PaginatedResponse<Product>> {
    const data = await this.model.findAlByCategoryId(categoryId, query, option);

    const adoptRows = data.rows.map(r => this.mapper.persistenceToDomain(r));

    return {
      rows: adoptRows,
      metaInfo: data.metaInfo,
    };
  }

  async findAllByProductTag(
    tags: ProductTag,
    query: IQuery,
    option?: ServiceOption
  ): Promise<PaginatedResponse<Product>> {
    const data = await this.model.findAllByProductTag(tags, query, option);

    const adoptRows = data.rows.map(r => this.mapper.persistenceToDomain(r));

    return {
      rows: adoptRows,
      metaInfo: data.metaInfo,
    };
  }
}
