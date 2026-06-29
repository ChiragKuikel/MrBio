import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { contactSchema } from '@mr-bio/core/shared';

const updateClientSchema = z
  .object({
    contacts: z.array(contactSchema),
  })
  .partial();

export class UpdateClientBody extends createZodDto(updateClientSchema) {}
