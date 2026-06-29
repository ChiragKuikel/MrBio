/* eslint-disable perfectionist/sort-objects */
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const loginResponseSchema: SchemaObject = {
  title: 'Login Response',
  properties: {
    id: { type: 'string' },
    firstName: { type: 'string' },
    middleName: { type: 'string', nullable: true },
    lastName: { type: 'string' },
    fullName: { type: 'string' },
    email: { type: 'string' },
    role: { enum: [] },
  },
};

export const loginResponseExample = {
  id: '7ceb0120-583b-44c4-8c31-1d0e63673561',
  email: 'super-admin@noveltytechnology.com',
  lastName: 'Admin',
  firstName: 'Super',
  fullName: 'Super Admin',
  middleName: null,
  roles: ['ADMIN'],
};
