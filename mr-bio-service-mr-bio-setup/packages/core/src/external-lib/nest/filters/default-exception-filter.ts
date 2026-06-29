import { AnyObj } from '../../../shared/domain/types/object';
import { IHttpResponse } from '../../../shared/domain/types/http';
import { getCurrentUTCDate } from '../../../shared/domain/utils/date';
import errorMessage from '../../../shared/domain/constants/messages/error-message';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionLogPublisherImpl } from '../../../shared/messaging/exception-log-publisher-impl';

@Catch(Error)
export class DefaultExceptionFilter implements ExceptionFilter {
  constructor(private readonly exceptionLogger: ExceptionLogPublisherImpl) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const responseBody: IHttpResponse = {
      data: null,
      timestamp: getCurrentUTCDate(),
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: {
        logMessage: exception.message,
        displayMessage: errorMessage.DEFAULT_ERROR,
      },
    };

    if (exception instanceof HttpException) {
      const httpResponse: AnyObj = <any>exception.getResponse();

      // status code
      responseBody.statusCode = exception.getStatus();

      // display message
      if (httpResponse?.message) {
        if (Array.isArray(httpResponse?.message)) {
          responseBody.error!.displayMessage = httpResponse.message[0];
        } else {
          responseBody.error!.displayMessage = httpResponse.message;
        }
      }

      // log message
      responseBody.error!.logMessage = (exception.cause ?? exception.stack ?? '').toString();
    }
    // log exception
    this.exceptionLogger.publishExceptionEvent(
      request,
      response,
      responseBody.error?.logMessage || '',
      exception
    );

    response.status(responseBody.statusCode).json(responseBody);
  }
}
