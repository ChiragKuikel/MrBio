import { BaseSchema } from '@mr-bio/core/external-lib';
import { Status } from '../../../../shared/enum/common';
import { ProductTag } from '../../domain/core/entities/product';

export interface IProduct {
  productId: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string[];
  isActive: boolean;
  discount?: string;
  finalPrice: number;
  stock?: number;
  brand?: string;
  images?: string[];
  tags?: ProductTag[];
  status: Status;
  rating?: number;
  metadata?: any;
}

export type ProductSchema = IProduct & BaseSchema;
