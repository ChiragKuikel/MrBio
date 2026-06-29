import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { querySchema } from '@mr-bio/core/shared';
import { UserStatus } from '../../domain/core/entities/user';

const activeUserQuerySchema = z
  .object({
    role: z.string(),
    email: z.string(),
    phone: z.string(),
    lastName: z.string(),
    firstName: z.string(),
  })
  .partial();

export class ActiveUserQueryParams extends createZodDto(querySchema.merge(activeUserQuerySchema)) {}

const userQuerySchema = querySchema.merge(activeUserQuerySchema).merge(
  z.object({
    status: z.nativeEnum(UserStatus).optional(),
  })
);

export class UserQueryParams extends createZodDto(userQuerySchema) {}
