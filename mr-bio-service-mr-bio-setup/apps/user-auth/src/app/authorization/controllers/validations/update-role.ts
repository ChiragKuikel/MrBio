import z from 'zod';
import { createZodDto } from 'nestjs-zod';
import { hierarchicalAssociatedResourceSchema } from '../../../../shared/validations/update-associated-resource';

export const updateRoleSchema = z
  .object({
    name: z.string().trim(),
  })
  .partial();

export class UpdateRoleBody extends createZodDto(updateRoleSchema) {}

export const updateRoleResourcesSchema = z.object({
  resources: z.array(hierarchicalAssociatedResourceSchema),
});

export class UpdateRoleResourcesBody extends createZodDto(updateRoleResourcesSchema) {}
