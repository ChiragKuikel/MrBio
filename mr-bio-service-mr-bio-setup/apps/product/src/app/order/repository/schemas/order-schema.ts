import { BaseSchema } from '@mr-bio/core/external-lib';
import { Contact, OrderItem, OrderStatus, Payment } from '../../domain/core/entities/order';

export interface IOrder {
  orderId: string;
  contact?: Contact;
  userId?: string;
  orderItems: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  payment: Payment;
  shippingAddress: string;
  shippingCost?: number;
}

export type OrderSchema = IOrder & BaseSchema;
