import { z } from 'zod';
import { dateSchema, Environment, HttpMethod } from '@mr-bio/core/shared';

export const createLatencyLogSchema = z.object({
  timestamp: dateSchema,
  endpoint: z.string().url(),
  method: z.nativeEnum(HttpMethod),
  responseTimeMs: z.number(),
  statusCode: z.number().int(),
  environment: z.nativeEnum(Environment),
  application: z.object({
    name: z.string(),
    id: z.string(),
  }),
  request: z.object({
    headers: z.record(z.string(), z.any()),
    body: z.record(z.any()),
    queryParams: z.record(z.any()),
  }),
  user: z
    .object({
      userId: z.string().optional(),
      ipAddress: z.string().optional(),
      roles: z.array(z.string()),
    })
    .optional(),
  meta: z.object({
    tags: z.array(z.string()),
    correlationId: z.string().optional(),
  }),
});
