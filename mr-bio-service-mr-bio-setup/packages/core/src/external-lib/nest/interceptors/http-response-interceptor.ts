// import { Response } from 'express';
// import { map } from 'rxjs/operators';
// import { IHttpResponse } from '../../../shared/domain/types/http';
// import { getCurrentUTCDate } from '../../../shared/domain/utils/date';
// import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';

// @Injectable()
// export class HttpResponseInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler) {
//     const response = context.switchToHttp().getResponse<Response>();

//     return next.handle().pipe(
//       map(({ data, message, statusCode }: IHttpResponse) => {
//         return <IHttpResponse>{
//           data,
//           message: message ?? 'Success',
//           timestamp: getCurrentUTCDate(),
//           statusCode: statusCode ?? (response.statusCode || 200),
//         };
//       })
//     );
//   }
// }
import { Response } from 'express';
import { map } from 'rxjs/operators';
import { IHttpResponse } from '../../../shared/domain/types/http';
import { getCurrentUTCDate } from '../../../shared/domain/utils/date';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const response = context.switchToHttp().getResponse<Response>();

    if (response.req.originalUrl.includes('/api/products/image/')) return next.handle();

    return next.handle().pipe(
      map(({ data, message, statusCode }: IHttpResponse) => {
        return <IHttpResponse>{
          data,
          message: message ?? 'Success',
          timestamp: getCurrentUTCDate(),
          statusCode: statusCode ?? (response.statusCode || 200),
        };
      })
    );
  }
}
