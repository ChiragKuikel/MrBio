import z from 'zod';
import { createZodDto } from 'nestjs-zod';
import { trimmedStringSchema } from '@mr-bio/core/shared';

export const updateNetworkInUsersSchema = z.object({
  id: z.string(),
  name: trimmedStringSchema,
  code: trimmedStringSchema,
});

export class UpdateNetworkInUsersBody extends createZodDto(updateNetworkInUsersSchema) {}
