import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Gender, addressSchema, phoneSchema, trimmedStringSchema } from '@mr-bio/core/shared';

const updateUserSchema = z
  .object({
    dob: trimmedStringSchema,
    email: z.string(),
    phones: z.array(phoneSchema),
    lastName: z.string(),
    firstName: z.string(),
    address: addressSchema,
    middleName: z.string(),
    gender: z.nativeEnum(Gender),
  })
  .partial();

export class UpdateUserBody extends createZodDto(updateUserSchema) {}
