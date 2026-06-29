/* eslint-disable perfectionist/sort-objects */
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
  remember: z.boolean().optional(),
});

export class LoginBody extends createZodDto(loginSchema) {}
