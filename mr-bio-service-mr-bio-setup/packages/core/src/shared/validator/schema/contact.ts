import z from 'zod';
import { ContactType, EmailType, PhoneType } from '../../domain';

export const phoneValueSchema = z.object({
  value: z.string(),
  countryCode: z.string().optional(),
  countryISO: z.string().optional(),
});

export const phoneSchema = phoneValueSchema.extend({
  type: z.nativeEnum(PhoneType),
});

export const emailSchema = z.object({
  type: z.nativeEnum(EmailType),
  value: z.string().email(),
});

export const contactSchema = z.object({
  name: z.string().optional(),
  phone: phoneValueSchema.optional(),
  email: z.string().optional(),
  type: z.nativeEnum(ContactType),
});
