import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Status } from '../../../../shared/enum/common';

const createCategoryDto = z.object({
  status: z.nativeEnum(Status),
  code: z.string(),
  name: z
    .string()
    .max(100, 'Category name cannot exceed 100 characters')
    .min(3, 'Category name cannot be less than 3 characters')
    .trim(),
  description: z
    .string()
    .max(100, 'Category description cannot exceed 100 characters')
    .min(3, 'Category description cannot be less than 3 characters')
    .trim(),
});

export class CreateCategoryBody extends createZodDto(createCategoryDto) {}
