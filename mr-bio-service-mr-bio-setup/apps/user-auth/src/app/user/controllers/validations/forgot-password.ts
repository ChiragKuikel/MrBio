import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export class ForgotPasswordBody extends createZodDto(forgotPasswordSchema) {}
