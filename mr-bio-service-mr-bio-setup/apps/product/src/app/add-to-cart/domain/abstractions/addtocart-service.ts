import { AddToCart } from '../core/entities/addtocart';
import { CreateAddToCartDto } from '../dtos/create-addtocart';
import { UpdateAddToCartDto } from '../dtos/update-addtocart';
import { BaseService, FindAllResponse, IQuery, Nullable, ServiceOption } from '@mr-bio/core/shared';

export abstract class AddToCartService extends BaseService<
  AddToCart,
  CreateAddToCartDto,
  UpdateAddToCartDto,
  IQuery
> {
  abstract addToCart(dto: CreateAddToCartDto, options?: IQuery): Promise<AddToCart>;
  abstract getByUserId(userId: string, options?: IQuery): Promise<FindAllResponse<AddToCart>>;
  abstract getByProductId(
    productId: string,
    userId: string,
    options?: ServiceOption
  ): Promise<Nullable<any>>;
}
