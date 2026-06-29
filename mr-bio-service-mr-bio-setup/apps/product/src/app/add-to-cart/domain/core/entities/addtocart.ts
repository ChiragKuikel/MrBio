import { BaseEntity } from '@mr-bio/core/shared';
import { Product } from '../../../../product/domain/core/entities/product';

export class AddToCart extends BaseEntity {
  productId: string;
  quantity: number;
  userId: string;
  subTotal?: number;
  total?: number;
  product?: Product;

  initialize(builder: {
    productId: string;
    quantity: number;
    userId: string;
    subTotal?: number;
    total?: number;
    product?: Product;
  }) {
    this.productId = builder.productId;
    this.quantity = builder.quantity;
    this.userId = builder.userId;
    this.subTotal = builder.subTotal;
    this.total = builder.total;
    this.product = builder.product;
  }
}
