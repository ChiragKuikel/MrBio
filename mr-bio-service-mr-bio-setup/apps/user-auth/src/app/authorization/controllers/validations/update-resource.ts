import z from 'zod';
import { createZodDto } from 'nestjs-zod';

export const updateResourceSchema = z.object({
  name: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
  parent: z.string().optional(),
  routePath: z.string().optional(),
  description: z.string().optional(),
});

export class UpdateResourceBody extends createZodDto(updateResourceSchema) {}

export const updateResourcePermissionsSchema = z.object({
  permissions: z.array(
    z.object({
      label: z.string(),
      description: z.string().optional(),
    })
  ),
});

export class UpdateResourcePermissionsBody extends createZodDto(updateResourcePermissionsSchema) {}
