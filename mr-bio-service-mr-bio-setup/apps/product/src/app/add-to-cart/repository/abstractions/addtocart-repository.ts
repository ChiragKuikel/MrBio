import { AddToCart } from '../../domain/core/entities/addtocart';
import {
  BaseRepository,
  FindAllResponse,
  IQuery,
  Nullable,
  ServiceOption,
} from '@mr-bio/core/shared';

export abstract class AddToCartRepository extends BaseRepository<AddToCart, IQuery> {
  abstract getByUserId(
    userId: string,
    options?: ServiceOption
  ): Promise<FindAllResponse<AddToCart>>;
  abstract getByProductId(productId: string, userId: string, options?: ServiceOption): Promise<any>;
}
