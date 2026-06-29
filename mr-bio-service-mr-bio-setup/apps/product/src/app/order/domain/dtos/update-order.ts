import { Contact, OrderStatus, Payment } from '../core/entities/order';

export type UpdateOrderDto = Partial<{
  contact?: Contact;
  userId?: string;
  orderItems?: {
    productId: string;
    quantity: number;
  }[];
  totalAmount?: number;
  status?: OrderStatus;
  payment?: Payment;
  shippingAddress?: string;
  shippingCost?: number;
}>;
