import z from 'zod';
import { createZodDto } from 'nestjs-zod';

export const hierarchicalAssociatedResourceSchema = z.object({
  code: z.string(),
  parent: z.string().optional(),
  isGranted: z.boolean().optional(),
  permissions: z.array(z.object({ code: z.string(), isGranted: z.boolean().optional() })),
  subModules: z
    .array(
      z.object({
        code: z.string(),
        parent: z.string().optional(),
        isGranted: z.boolean().optional(),
        permissions: z.array(z.object({ code: z.string(), isGranted: z.boolean().optional() })),
      })
    )
    .optional(),
});

export class HierarchicalAssociatedResourceBody extends createZodDto(
  hierarchicalAssociatedResourceSchema
) {}
