import { RedisPrefix } from './cache-constant';
import errorMessage from './messages/error-message';
import serviceRoute from './service-route-constants';
import successMessage from './messages/success-message';
import { serviceNameConstants } from '@mr-bio/core/shared';

export { successMessage, errorMessage, serviceRoute, RedisPrefix };

export const SERVICE_NAME = serviceNameConstants.USER;

export const ACCESS_TOKEN_EXPIRY_TIME_IN_MIN = 1440;
export const REFRESH_TOKEN_EXPIRY_TIME_IN_MIN = 1440; // 1 day
export const REFRESH_TOKEN_EXPIRY_TIME_IN_MIN_FOR_REMEMBER_ME = 10080; //7 day

export const DEFAULT_TOKEN_EXPIRY_TIME_IN_MIN = 15;

export const LOGIN_TOKEN_VALIDITY_MIN = 5;
export const RESET_PASSWORD_TOKEN_VALIDITY_MIN = 1440; // 1 day
export const ACCOUNT_ACTIVATION_TOKEN_VALIDITY_MIN = 1440; // 1 day
