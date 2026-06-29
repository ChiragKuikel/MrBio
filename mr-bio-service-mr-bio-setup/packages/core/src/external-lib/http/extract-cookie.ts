import { HttpRequest } from '../../shared';

export function extractCookies(req: HttpRequest): { [key: string]: string } {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(';').reduce((cookies: { [key: string]: string }, cookieStr: string) => {
    const [name, ...rest] = cookieStr.trim().split('=');
    cookies[name!] = rest.join('=');

    return cookies;
  }, {});
}
