import errorMessage from './messages/error-message';
import serviceRoute from './service-route-constants';
import successMessage from './messages/success-message';
import { CountResponse, PaginatedResponse, PaginationMetaInfo } from '../types';

export { successMessage as coreSuccessMessage, errorMessage as coreErrorMessage, serviceRoute };
export * from './permissions';
export * from './service-name-constants';
export * from './crypto-config';

export const APP_NAME = 'Mr Bio';

export const SYSTEM = 'System';
export const SOFT_DELETION_FIELD = 'deleted';

// Cookies
export const ACCESS_TOKEN_COOKIE_KEY = 'accessToken';
export const REFRESH_TOKEN_COOKIE_KEY = 'refreshToken';

// Headers
export const REFRESH_TOKEN_HEADER = 'refresh-token';
export const AUTHORIZATION_HEADER = 'authorization';
export const AUTH_ENTITY_HEADER = 'x-auth-entity';
export const CLIENT_ASSIGNER_HEADER = 'x-client-assigner';
export const ORGANIZATION_ID_HEADER = 'x-org-id';
export const SERVICE_AUTHORIZATION_HEADER = 'Service-Authorization';
export const VERIFICATION_TOKEN_HEADER = 'Verification-Token';

export const SERVICE_TOKEN_EXPIRY_TIME_IN_MIN = 5;
export const DEFAULT_TOKEN_EXPIRY_TIME_IN_MIN = 15;

export const DATE_FORMAT = 'MM/dd/yyyy';
export const DATE_TIME_FORMAT = 'MM/dd/yyyy hh:mm:ss a';
export const DATE_TIME_LONG_FORMAT = 'EEEE dd LLLL, yyyy HH:mm:ss a'; //2024-01-10T03:09:36.184Z => Monday 08 January, 2024 03:09:36 UTC

export const S3_UPLOAD_PRESIGNED_URL_EXPIRY = 5 * 60;

export const EMPTY_PAGINATION_META_INFO: PaginationMetaInfo = {
  totalPage: 0,
  currentPage: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};
export const EMPTY_PAGINATED_RESPONSE: PaginatedResponse = {
  rows: [],
  metaInfo: EMPTY_PAGINATION_META_INFO,
};

export const EMPTY_COUNT_RESPONSE: CountResponse = {
  count: 0,
};

// export const KAFKA_CLIENT_NAME = 'KAFKA-CLIENT';
