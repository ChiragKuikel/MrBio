import { Injectable } from '@nestjs/common';
import { AddToCartModel } from './models/addtocart-model';
import { AddToCartSchema } from './schemas/addtocart-schema';
import { AddToCart } from '../domain/core/entities/addtocart';
import { BaseRepositoryImpl } from '@mr-bio/core/external-lib';
import { AddToCartRepository } from './abstractions/addtocart-repository';
import { AddToCartPersistenceMapper } from './mappers/addtocart-persistence-mapper';
import { FindAllResponse, IQuery, Nullable, ServiceOption } from '@mr-bio/core/shared';
import { ProductRepository } from '../../product/repository/abstractions/product-repository';

@Injectable()
export class AddToCartRepositoryImpl
  extends BaseRepositoryImpl<AddToCart, AddToCartSchema, IQuery>
  implements AddToCartRepository
{
  constructor(
    private productRepository: ProductRepository,
    protected model: AddToCartModel,
    protected mapper: AddToCartPersistenceMapper
  ) {
    super(model, mapper);
  }
  async getByUserId(userId: string, options?: ServiceOption): Promise<FindAllResponse<AddToCart>> {
    const result = await this.model.getByUserId(userId, options);
    await Promise.all(
      result.map(async item => {
        item.product = (await this.productRepository.findOneById(item.productId, options)) as any;
      })
    );

    return result.map(row => this.mapper.persistenceToDomain(row));
  }

  async getByProductId(
    productId: string,
    userId: string,
    options?: ServiceOption
  ): Promise<AddToCart> {
    const result = await this.model.getByProductId(productId, userId, options);
    // if (!result) return null;

    return result as unknown as AddToCart;
  }
}
