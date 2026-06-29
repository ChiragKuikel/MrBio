import { z } from 'zod';
import { dateSchema, Environment, ExceptionLevel, HttpMethod } from '@mr-bio/core/shared';

export const createExceptionLogSchema = z.object({
  timestamp: dateSchema,
  application: z.object({
    name: z.string(),
    id: z.string(),
  }),
  environment: z.nativeEnum(Environment),
  level: z.nativeEnum(ExceptionLevel),
  message: z.string(),
  request: z.object({
    method: z.nativeEnum(HttpMethod),
    url: z.string().url(),
    headers: z.record(z.string(), z.any()),
    body: z.record(z.any()),
    queryParams: z.record(z.any()),
    ipAddress: z.string().optional(),
  }),
  response: z.object({
    statusCode: z.number().int(),
    headers: z.record(z.string(), z.any()).optional(),
  }),
  user: z
    .object({
      userId: z.string().optional(),
      email: z.string().email().optional(),
      roles: z.array(z.string()),
    })
    .optional(),
  exception: z.object({
    type: z.string(),
    message: z.string(),
    stackTrace: z.string().optional(),
  }),
  meta: z.object({
    service: z.string(),
    host: z.string(),
    tags: z.array(z.string()),
    correlationId: z.string().optional(),
  }),
});
