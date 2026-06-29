import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { errorMessage } from '../../../../shared/constants';
import { Gender, phoneSchema, trimmedStringSchema } from '@mr-bio/core/shared';

const createUserDto = z.object({
  lastName: z.string(),
  firstName: z.string(),
  email: z.string().email(),
  dob: trimmedStringSchema.optional(),
  phones: z.array(phoneSchema).optional(),
  gender: z.nativeEnum(Gender),
  middleName: z.string().optional(),
  address: z
    .object({
      zip: z.string(),
      city: z.string(),
      state: z.string(),
      line1: z.string(),
      line2: z.string().optional(),
    })
    .optional(),
  // organizationId: z.string(),
  password: z.string(),
  roleCodes: z.array(z.string()).min(1, { message: errorMessage.ROLE_REQUIRED }),
});

export class CreateUserBody extends createZodDto(createUserDto) {}
