import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const activateAccountSchema = z.object({
  token: z.string(),
  password: z.string(),
});

export class ActivateAccountBody extends createZodDto(activateAccountSchema) {}
