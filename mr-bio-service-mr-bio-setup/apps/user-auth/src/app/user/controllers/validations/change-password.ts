import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

export class ChangePasswordBody extends createZodDto(changePasswordSchema) {}
