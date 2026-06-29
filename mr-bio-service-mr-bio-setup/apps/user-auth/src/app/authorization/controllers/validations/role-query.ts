import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { querySchema } from '@mr-bio/core/shared';

const roleQuerySchema = querySchema.merge(
  z
    .object({
      name: z.string(),
    })
    .partial()
);

export class RoleQueryParams extends createZodDto(roleQuerySchema) {}
