import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const createAddToCartDto = z.object({
  productId: z.string(),
  quantity: z.number().min(1),
  userId: z.string(),
  subTotal: z.number().optional(),
  total: z.number().optional(),
});

export class CreateAddToCartBody extends createZodDto(createAddToCartDto) {}
