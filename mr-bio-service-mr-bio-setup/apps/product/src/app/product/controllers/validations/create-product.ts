import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Status } from '../../../../shared/enum/common';
import { ProductTag } from '../../domain/core/entities/product';

// const createProductDto = z.object({
//   name: z.string().trim(),
//   description: z.string(),
//   price: z.number(),
//   categoryId: z.array(z.string()),
//   isActive: z.boolean(),
//   discount: z.string().optional(),
//   finalPrice: z.number(),
//   stock: z.number().optional(),
//   brand: z.string().optional(),
//   images: z.array(z.string()).optional(),
//   tags: z.array(z.nativeEnum(ProductTag)).optional(),
//   status: z.nativeEnum(Status),
//   rating: z.number().optional(),
//   metadata: z.any().optional(),
// });

// export class CreateProductBody extends createZodDto(createProductDto) {}
// //
const createProductDto = z.object({
  name: z.string().trim(),
  description: z.string(),
  price: z.coerce.number(),
  categoryId: z.coerce
    .string()
    .transform(val => val.split(',')) // Assuming comma-separated list in form-data
    .pipe(z.array(z.string())),
  isActive: z.coerce.boolean(),
  discount: z.string().optional(),
  finalPrice: z.coerce.number(),
  stock: z.coerce.number().optional(),
  brand: z.string().optional(),
  images: z.coerce
    .string()
    .transform(val => val.split(',')) // optional if images sent as comma-separated strings
    .optional()
    .pipe(z.array(z.string()))
    .optional(),
  tags: z.coerce
    .string()
    .transform(val => val.split(','))
    .optional()
    .pipe(z.array(z.nativeEnum(ProductTag))),
  status: z.nativeEnum(Status),
  rating: z.coerce.number().optional(),
  metadata: z.any().optional(),
});
export class CreateProductBody extends createZodDto(createProductDto) {}
