import { IHttpResponse } from '../../../shared/domain/types/http';
import { getCurrentUTCDate } from '../../../shared/domain/utils/date';
import { DomainException } from '../../../shared/domain/exception/domain-exception';
import { ConflictException } from '../../../shared/domain/exception/conflict-exception';
import { NotFoundException } from '../../../shared/domain/exception/not-found-exception';
import { BadRequestException } from '../../../shared/domain/exception/bad-request-exception';
import { UnauthorizedException } from '../../../shared/domain/exception/unauthorized-exception';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const responseBody: IHttpResponse = {
      data: null,
      timestamp: getCurrentUTCDate(),
      statusCode: this.getStatusCodeForDomainException(exception),
      error: {
        logMessage: exception.detail,
        displayMessage: exception.message,
      },
    };
    response.status(responseBody.statusCode).json(responseBody);
  }

  private getStatusCodeForDomainException(exception: unknown): number {
    if (exception instanceof ConflictException) return HttpStatus.CONFLICT;
    if (exception instanceof ForbiddenException) return HttpStatus.FORBIDDEN;
    if (exception instanceof UnauthorizedException) return HttpStatus.UNAUTHORIZED;
    if (exception instanceof NotFoundException) return HttpStatus.NOT_FOUND;
    if (exception instanceof BadRequestException) return HttpStatus.BAD_REQUEST;

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
