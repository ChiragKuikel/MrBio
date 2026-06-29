import z from 'zod';
import { createZodDto } from 'nestjs-zod';
import { hierarchicalAssociatedResourceSchema } from '../../../../shared/validations/update-associated-resource';

export const updateUserResourcesSchema = z.object({
  resources: z.array(hierarchicalAssociatedResourceSchema),
});

export class UpdateUserResourcesBody extends createZodDto(updateUserResourcesSchema) {}
