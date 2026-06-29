import z from 'zod';
import { createZodDto } from 'nestjs-zod';

/* deprecated 
need to rework according to the new schema*/
export const updateMFAStatusSchema = z.object({
  enableMFA: z.boolean(),
});

export class UpdateMFAStatusBody extends createZodDto(updateMFAStatusSchema) {}
