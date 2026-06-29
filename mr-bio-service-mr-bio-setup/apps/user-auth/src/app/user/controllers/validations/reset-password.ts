import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string(),
});

export class ResetPasswordBody extends createZodDto(resetPasswordSchema) {}
