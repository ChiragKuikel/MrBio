import { ILogApplication, IHttpResponse } from '../types';
import { AuthEntity, HttpRequest as Request } from '@mr-bio/core/shared';

/**
 * Constructs an HTTP response object with the given data and message.
 * @param data The data to include in the response.
 * @param message A message to include in the response.
 * @returns The constructed HTTP response object containing the data and message.
 */
export function buildHttpResponse<T>(data: T, message: string, count?: number): IHttpResponse<T> {
  return {
    data,
    count,
    message,
  };
}

/**
 * Fetch ip of the requesting client
 * @param request the request object
 * @returns ip of the requesting client
 */
export function getIpFromRequest(request: Request): string {
  let ip = request.ip || 'N/A',
    ips: string[] = [];
  const xForwardedFor = request.headers['x-forwarded-for'];
  if (typeof xForwardedFor === 'string') {
    ips = xForwardedFor.split(',');
  } else if (typeof xForwardedFor === 'object') {
    ips = xForwardedFor;
  }
  ip = ips.length ? ips[0]?.trim() || ip : ip;
  if (ip === '::1') return '127.0.0.1'; //localhost

  return ip;
}

/**
 * fetch id and name of the application that called the api.
 * @param authEntity information of the authenticated user
 * @returns ILogApplication - name and id of the organization
 */
// export function getOrganizationInfo(authEntity?: AuthEntity): ILogApplication {
//   const app: ILogApplication = {
//     id: authEntity?.organizationId || 'System',
//     name: authEntity?.organizationName || 'System',
//   };

//   return app;
// }

/**
 * get full api url for a request
 * @param req original request object
 * @returns full url of the api called
 */
export function getFullUrl(req: Request): string {
  const protocol = req.protocol; // HTTP or HTTPS
  const host = req.get('host'); // Hostname and port (e.g., localhost:3000)
  const path = req.originalUrl; // Full URL path, including query parameters

  return `${protocol}://${host}${path}`;
}
