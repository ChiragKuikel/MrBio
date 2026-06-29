import { Product, ProductTag } from '../../domain/core/entities/product';
import { BaseRepository, IQuery, PaginatedResponse, ServiceOption } from '@mr-bio/core/shared';

export abstract class ProductRepository extends BaseRepository<Product, IQuery> {
  abstract findAllByCategoryId(
    categoryId: string,
    query: IQuery,
    option?: ServiceOption
  ): Promise<PaginatedResponse<Product>>;

  abstract findAllByProductTag(
    tags: ProductTag,
    query: IQuery,
    option?: ServiceOption
  ): Promise<PaginatedResponse<Product>>;

  abstract findAllProduct(
    query: IQuery,
    option?: ServiceOption
  ): Promise<PaginatedResponse<Product>>;
}
