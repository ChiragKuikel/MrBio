import { AuthEntity } from '../../../shared';
import { HttpRequest } from '../../../shared/domain/types/http';
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const AuthEntityDecorator = createParamDecorator((_: any, context: ExecutionContext) => {
  const request: HttpRequest = context.switchToHttp().getRequest();

  return request.authEntity;
});

// export const AuthEntityDecorator = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext): AuthEntity => {
//     const request = ctx.switchToHttp().getRequest();

//     // Standard location where Passport puts authenticated user
//     if (request.user) {
//       return request.user as AuthEntity;
//     }

//     // If your system uses a custom header (less common)
//     const authHeader = request.headers['x-auth-entity'] || request.headers['auth-entity'];
//     if (authHeader) {
//       try {
//         return JSON.parse(authHeader) as AuthEntity;
//       } catch (e) {
//         console.error('Failed to parse auth entity header:', e);
//       }
//     }

//     // Return null or throw error based on your needs
//     throw new UnauthorizedException();
//   }
// );
export const AuthServiceDecorator = createParamDecorator((_: any, context: ExecutionContext) => {
  const request: HttpRequest = context.switchToHttp().getRequest();

  return request.authService;
});
