import { Maybe } from '../types';
import { Environment } from '../enum';
import { randomUUID } from 'node:crypto';
import { coreErrorMessage } from '../constants';
import { BadRequestException } from '@nestjs/common';

/**
 * Pauses execution for a specified amount of time.
 * @param time
 */
export async function sleep(time: number) {
  return new Promise(res => {
    setTimeout(() => {
      res(true);
    }, time);
  });
}

/**
 * Generates a random OTP (One-Time Password) with the specified number of digits.
 * @param numberOfDigits
 * @returns OTP of type `string`
 */
export function generateOTP(numberOfDigits: number): string {
  const min = parseInt('1'.repeat(numberOfDigits));
  const max = parseInt('9'.repeat(numberOfDigits));

  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

/**
 * Generates a random UUID.
 * @returns UUID
 */
export const getUUID = () => randomUUID();

/**
 * Generates a username based on the provided first name, last name, and optional date of birth.
 * @param firstName
 * @param lastName
 * @param dob
 * @returns username
 */
export function generateUsername(firstName: string, lastName: string, dob?: string): string {
  let dobDate: Maybe<Date>;
  if (dob) {
    try {
      dobDate = new Date(dob);
    } catch (error) {
      dobDate = undefined;
    }
  }

  // Extract initials from first and last name
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  // Extract last two digits from birth year
  const birthYearDigits = dobDate ? dobDate.getFullYear() % 100 : '';

  const randomSuffix = Math.floor(Math.random() * 100); // Add random number as a suffix

  const username = `${initials}${birthYearDigits}${randomSuffix}`;

  return username;
}

/**
 * Appends the environment suffix to a value if the environment is not production.
 * @param env
 * @param value
 * @returns value with the environment suffix if applicable
 */
export function attachEnv(env: string, value: string): string {
  return env != Environment.PROD ? `${value}_${env}` : value;
}

/**
 * Removes the environment suffix from a value if the environment is not production.
 * @param env
 * @param value
 * @returns value without the environment suffix if applicable
 */
export function detachEnv(env: string, value: string) {
  return env != Environment.PROD ? value.replace('_' + env, '') : value;
}

/**
 * Validates website url
 * @param url
 * @returns url if valid, otherwise throws error
 */
export function validateWebsite(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    throw new BadRequestException(coreErrorMessage.INVALID_WEBSITE_URL);
  }

  return url;
}

export function trimValue(value: string): string {
  return value.trim();
}
