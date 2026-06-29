import { BaseEntity } from '@mr-bio/core/shared';
import { Product } from '../../../../product/domain/core/entities/product';

export class Order extends BaseEntity {
  contact?: Contact;
  userId?: string;
  orderItems: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  payment: Payment;
  shippingAddress: string;
  shippingCost?: number;
  initialize(builder: {
    contact?: Contact;
    userId?: string;
    orderItems: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    payment: Payment;
    shippingAddress: string;
    shippingCost?: number;
  }) {
    this.contact = builder.contact;
    this.userId = builder.userId;
    this.orderItems = builder.orderItems;
    this.totalAmount = builder.totalAmount;
    this.status = builder.status;
    this.payment = builder.payment;
    this.shippingAddress = builder.shippingAddress;
    this.shippingCost = builder.shippingCost;
  }
}

export class Contact {
  name: string;
  email: string;
  phone: string;
  address: string;
}
export class Payment {
  method: PaymentMethod;
  status: PaymentStatus;
  date?: any;
  amount?: number;
}
export class OrderItem {
  product: Product;
  quantity: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CHEQUE = 'cheque',
  OTHER = 'other',
}
