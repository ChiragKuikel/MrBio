import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import {
  OrderStatus,
  Payment,
  PaymentMethod,
  PaymentStatus,
} from '../../domain/core/entities/order';

const createOrderDto = z.object({
  contact: z
    .object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      address: z.string(),
    })
    .optional(),
  userId: z.string(),
  totalAmount: z.number(),
  status: z.nativeEnum(OrderStatus),
  payment: z.object({
    method: z.nativeEnum(PaymentMethod),
    status: z.nativeEnum(PaymentStatus),
    date: z.any(),
    amount: z.number().optional(),
  }),
  shippingAddress: z.string(),
  shippingCost: z.number().optional(),
  orderItems: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    })
  ),
});

export class CreateOrderBody extends createZodDto(createOrderDto) {}
