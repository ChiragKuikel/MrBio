import z from 'zod';
import { createZodDto } from 'nestjs-zod';

export const assignRolesToUserSchema = z.object({
  roles: z.array(z.string()),
});

export class AssignRolesToUserBody extends createZodDto(assignRolesToUserSchema) {}
