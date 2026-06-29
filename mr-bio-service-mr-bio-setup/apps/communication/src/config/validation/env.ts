import z from 'zod';
import { appSchema, Environment, kafkaSchema, mongodbSchema } from '@mr-bio/core/shared';

/*
Although the env is already validated by the core package,
we need to validate it again here to ensure that the env is valid
The Environment enum is being imported and used with z.nativeEnum().
When using imported enums with Zod, sometimes the type information gets lost.
*/
const envSchema = z.object({
  ENV: z.nativeEnum(Environment),
});
export const configSchema = z
  .object({
    SENDGRID_KEY: z.string(),
    SENDGRID_SENDER_NAME: z.string(),
    SENDGRID_SENDER_EMAIL: z.string(),
  })
  .merge(appSchema)
  .merge(envSchema)
  .merge(mongodbSchema);
// .merge(kafkaSchema);

export type IEnvConfig = z.infer<typeof configSchema>;
