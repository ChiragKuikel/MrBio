import { ProductTag } from '../core/entities/product';
import { Status } from '../../../../shared/enum/common';

export type UpdateProductDto = Partial<{
  name: string;
  description?: string;
  price: number;
  categoryId: string[];
  isActive: boolean;
  discount?: string; // percentage or fixed amount
  finalPrice: number;
  stock?: number;
  brand?: string;
  images: string[];
  tags?: ProductTag[];
  status: Status;
  rating?: number;
  metadata?: any;
}>;
