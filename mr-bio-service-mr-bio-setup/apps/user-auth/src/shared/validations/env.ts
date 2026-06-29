import z from 'zod';
import {
  appSchema,
  Environment,
  kafkaSchema,
  mongodbSchema,
  redisSchema,
} from '@mr-bio/core/shared';

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
    UI_BASE_URL: z.string(),
    DEFAULT_USER_PASSWORD: z.string(),
    NETWORK_BASE_URL: z.string(),
    AUTH_TOKEN_SECRET: z.string(),
    MFA_TOKEN_KEY: z.string(),
  })
  .merge(appSchema)
  .merge(envSchema)
  .merge(mongodbSchema);
// .merge(kafkaSchema)
// .merge(redisSchema);

export type IEnvConfig = z.infer<typeof configSchema>;
