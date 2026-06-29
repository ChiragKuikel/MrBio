import { BaseEntity } from '@mr-bio/core/shared';
import { Status } from '../../../../../shared/enum/common';

export class Product extends BaseEntity {
  name: string;
  description?: string;
  price: number;
  categoryId: string[];
  isActive: boolean;
  discount?: string; // percentage or fixed amount
  finalPrice: number;
  stock?: number;
  brand?: string;
  images?: string[];
  tags?: ProductTag[];
  status: Status;
  rating?: number;
  metadata?: any;

  initialize(builder: {
    name: string;
    description?: string;
    price: number;
    categoryId: string[];
    isActive: boolean;
    discount?: string; // percentage or fixed amount
    finalPrice: number;
    stock?: number;
    brand?: string;
    images?: string[];
    tags?: ProductTag[];
    status: Status;
    rating?: number;
    metadata?: any;
  }) {
    this.name = builder.name;
    this.description = builder.description;
    this.price = builder.price;
    this.categoryId = builder.categoryId;
    this.isActive = builder.isActive;
    this.discount = builder.discount;
    this.finalPrice = builder.finalPrice;
    this.stock = builder.stock;
    this.brand = builder.brand;
    this.images = builder.images;
    this.tags = builder.tags;
    this.status = builder.status;
    this.rating = builder.rating;
    this.metadata = builder.metadata;
  }
}
export enum ProductTag {
  NEW_ARRIVAL = 'new_arrival',
  BEST_SELLER = 'best_seller',
  FEATURED = 'New Feature',
  SALE = 'sale',
  DISCOUNT = 'discount',
}
