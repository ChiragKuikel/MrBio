import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { MfaAction } from '../../domain/core/entities/mfa';

const verifyOtpSchema = z.object({
  code: z.string(),
  token: z.string(),
  action: z.nativeEnum(MfaAction),
});

export class VerifyOtpBody extends createZodDto(verifyOtpSchema) {}
