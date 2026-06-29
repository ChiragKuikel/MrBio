import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { contactSchema } from '@mr-bio/core/shared';

const createClientDto = z.object({
  contacts: z.array(contactSchema).optional(),
});

export class CreateClientBody extends createZodDto(createClientDto) {}
