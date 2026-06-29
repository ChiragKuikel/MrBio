import z from 'zod';
import { appSchema, mongodbSchema } from '@mr-bio/core/shared';

export const configSchema = z.object({}).merge(appSchema).merge(mongodbSchema);

export type IEnvConfig = z.infer<typeof configSchema>;
