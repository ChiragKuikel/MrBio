import z from 'zod';
import { ProjectModule, assignerSchema } from '@mr-bio/core/shared';

export const createActivityLogSchema = z.object({
  logged: assignerSchema.optional(),
  tags: z.array(z.string().optional()),
  userVisibility: z.boolean().default(true),
  severity: z.string().nullable().optional().default('MEDIUM'),
  event: z.object({
    type: z.string(),
    subType: z.string().nullable().optional(),
  }),
  log: z.object({
    module: z.string(),
    note: z.string().nullable().optional(),
    type: z.string().default('INFORMATION'),
    subModule: z.string().nullable().optional(),
    attributes: z
      .object({
        data: z.any().optional(),
        reference: z
          .object({
            refId: z.string().optional(),
            projectModule: z.nativeEnum(ProjectModule),
          })
          .optional(),
      })
      .optional(),
  }),
});
