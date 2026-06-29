import z from 'zod';
import { createZodDto } from 'nestjs-zod';
import { MfaAction } from '../../domain/core/entities/mfa';

export const generateOtpSchema = z.object({
  action: z.nativeEnum(MfaAction),
  userIdentifier: z.string(),
});

export class GenerateOtpBody extends createZodDto(generateOtpSchema) {}
