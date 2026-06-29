import z from 'zod';
import { createZodDto } from 'nestjs-zod';
import { UserStatus } from '../../domain/core/entities/user';

export const updateUserStatusSchema = z.object({
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE]),
});

export class UpdateUserStatusBody extends createZodDto(updateUserStatusSchema) {}
