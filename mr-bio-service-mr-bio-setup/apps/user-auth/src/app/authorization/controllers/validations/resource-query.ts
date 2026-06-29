import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { querySchema } from '@mr-bio/core/shared';

const resourceQuerySchema = querySchema.merge(
  z
    .object({
      name: z.string(),
      code: z.string(),
    })
    .partial()
);

export class ResourceQueryParams extends createZodDto(resourceQuerySchema) {}
