import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const resendOtpSchema = z.object({
  otpToken: z.string(),
});

export class ResendOtpBody extends createZodDto(resendOtpSchema) {}
