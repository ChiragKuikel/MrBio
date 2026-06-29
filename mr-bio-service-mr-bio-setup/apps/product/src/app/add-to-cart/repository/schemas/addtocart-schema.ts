import { BaseSchema } from '@mr-bio/core/external-lib';
import { ProductSchema } from '../../../product/repository/schemas/product-schema';

export interface IAddToCart {
  addToCartId: string;
  productId: string;
  quantity: number;
  userId: string;
  subTotal?: number;
  total?: number;
  product?: ProductSchema;
}

export type AddToCartSchema = IAddToCart & BaseSchema;
