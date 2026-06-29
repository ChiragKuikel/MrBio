import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../../domain/core/entities/order';

const updateOrderSchema = z
  .object({
    contact: z
      .object({
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        address: z.string(),
      })
      .optional(),
    userId: z.string().optional(),
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
  })
  .partial();

export class UpdateOrderBody extends createZodDto(updateOrderSchema) {}
