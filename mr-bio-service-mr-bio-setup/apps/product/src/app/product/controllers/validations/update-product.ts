import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Status } from '../../../../shared/enum/common';
import { ProductTag } from '../../domain/core/entities/product';

const updateProductSchema = z
  .object({
    name: z.string().trim(),
    description: z.string(),
    price: z.number(),
    categoryId: z.array(z.string()),
    isActive: z.boolean(),
    discount: z.string().optional(),
    finalPrice: z.number(),
    stock: z.number().optional(),
    brand: z.string().optional(),
    images: z.array(z.string()).optional(),
    tags: z.array(z.nativeEnum(ProductTag)).optional(),
    status: z.nativeEnum(Status),
    rating: z.number().optional(),
    metadata: z.any().optional(),
  })
  .partial();

export class UpdateProductBody extends createZodDto(updateProductSchema) {}
