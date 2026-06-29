import z from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createResourceSchema = z.object({
  name: z.string(),
  order: z.number(),
  icon: z.string().optional(),
  parent: z.string().optional(),
  routePath: z.string().optional(),
  description: z.string().optional(),
  permissions: z
    .array(
      z.object({
        label: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .optional(),
});

export class CreateResourceBody extends createZodDto(createResourceSchema) {}
