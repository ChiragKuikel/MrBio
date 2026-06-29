import z from 'zod';
import { createZodDto } from 'nestjs-zod';

const createClientAccessTokenSchema = z.object({
  clientSecret: z.string(),
  roles: z.array(z.string()).min(1),
  networkIds: z.array(z.string()).optional(),
});

export class CreateClientAccessTokenBody extends createZodDto(createClientAccessTokenSchema) {}
