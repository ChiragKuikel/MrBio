import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const sendAccountActivationSchema = z.object({
  email: z.string(),
});

export class SendAccountActivationBody extends createZodDto(sendAccountActivationSchema) {}
