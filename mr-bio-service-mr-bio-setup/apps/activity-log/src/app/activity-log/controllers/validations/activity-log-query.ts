import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { dateSchema, querySchema } from '@mr-bio/core/shared';

const activityLogQuerySchema = querySchema.merge(
  z
    .object({
      userId: z.string(),
      module: z.string(),
      endDate: dateSchema,
      startDate: dateSchema,
    })
    .partial()
);

export class ActivityLogQueryParams extends createZodDto(activityLogQuerySchema) {}
