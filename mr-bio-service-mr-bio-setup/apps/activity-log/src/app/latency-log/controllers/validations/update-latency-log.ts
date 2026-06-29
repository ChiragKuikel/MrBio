import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const updateLatencyLogSchema = z.object({}).partial();

export class UpdateLatencyLogBody extends createZodDto(updateLatencyLogSchema) {}
