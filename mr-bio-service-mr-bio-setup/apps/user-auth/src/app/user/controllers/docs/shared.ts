/* eslint-disable perfectionist/sort-objects */
import { Gender } from '@mr-bio/core/shared';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const userResponseSchema: SchemaObject = {
  title: 'User Response',
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string', nullable: true },
    username: { type: 'string' },
    firstName: { type: 'string' },
    middleName: { type: 'string', nullable: true },
    lastName: { type: 'string' },
    dob: { type: 'date', nullable: true },
    gender: { enum: Object.values(Gender) },
    role: { enum: [] },
    address: {
      properties: {
        addressLine1: { type: 'string', nullable: true },
        addressLine2: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        zipCode: { type: 'string' },
      },
      nullable: true,
    },
  },
};

export const userResponseExample = {
  id: 'f95988c3-57a6-46df-89b2-0a2bd30f288f',
  firstName: 'David',
  middleName: 'Robert',
  lastName: 'Johnson',
  username: 'DJ8825',
  email: 'david.johnson@example.com',
  phone: '555-123-4567',
  dob: '1988-09-20T00:00:00.000Z',
  gender: 'Male',
  role: 'ADMIN',
  address: {
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    addressLine1: '789 Maple Street',
    addressLine2: 'Unit 301',
  },
};
