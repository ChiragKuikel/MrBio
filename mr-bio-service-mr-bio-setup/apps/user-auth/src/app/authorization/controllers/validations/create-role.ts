import z from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createRoleSchema = z.object({
  name: z.string().trim(),
});

export class CreateRoleBody extends createZodDto(createRoleSchema) {}
