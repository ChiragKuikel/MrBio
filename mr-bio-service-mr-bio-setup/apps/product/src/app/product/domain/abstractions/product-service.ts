import { CreateProductDto } from '../dtos/create-product';
import { UpdateProductDto } from '../dtos/update-product';
import { Product, ProductTag } from '../core/entities/product';
import { BaseService, IQuery, PaginatedResponse, ServiceOption } from '@mr-bio/core/shared';

export abstract class ProductService extends BaseService<
  Product,
  CreateProductDto,
  UpdateProductDto,
  IQuery
> {
  abstract getProduct(query: IQuery, option?: ServiceOption): Promise<PaginatedResponse<Product>>;

  abstract getByCategoryId(
    categoryId: string,
    query: IQuery,
    options: ServiceOption
  ): Promise<PaginatedResponse<Product>>;

  abstract getByProductTag(
    tags: ProductTag,
    query: IQuery,
    options: ServiceOption
  ): Promise<PaginatedResponse<Product>>;
}
