import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const updateExceptionLogSchema = z.object({}).partial();

export class UpdateExceptionLogBody extends createZodDto(updateExceptionLogSchema) {}
