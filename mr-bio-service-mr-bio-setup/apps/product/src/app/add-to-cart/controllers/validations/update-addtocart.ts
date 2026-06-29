import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const updateAddToCartSchema = z
  .object({
    productId: z.string().optional(),
    quantity: z.number().min(1).optional(),
    userId: z.string().optional(),
    subTotal: z.number().optional(),
    total: z.number().optional(),
  })
  .partial({});

export class UpdateAddToCartBody extends createZodDto(updateAddToCartSchema) {}
