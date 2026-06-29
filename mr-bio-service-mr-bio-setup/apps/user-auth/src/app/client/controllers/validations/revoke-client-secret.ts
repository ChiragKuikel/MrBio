import z from 'zod';
import { createZodDto } from 'nestjs-zod';

const revokeClientSecretSchema = z.object({
  clientSecret: z.string(),
});

export class RevokeClientSecretBody extends createZodDto(revokeClientSecretSchema) {}
