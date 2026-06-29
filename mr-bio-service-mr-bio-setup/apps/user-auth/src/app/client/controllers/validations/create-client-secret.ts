import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { trimmedStringSchema } from '@mr-bio/core/shared';

const createClientSecretDto = z.object({
  name: trimmedStringSchema,
  allowedSources: z.array(trimmedStringSchema).min(1),
});

export class CreateClientSecretBody extends createZodDto(createClientSecretDto) {}
