import { MongoServerError } from 'mongodb';
import { formatMongoDispalyError } from '../../../shared';
import { IHttpResponse } from '../../../shared/domain/types/http';
import { getCurrentUTCDate } from '../../../shared/domain/utils/date';
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import errorMessage from '../../../shared/domain/constants/messages/error-message';

@Catch(MongoServerError)
export class MongoDBExceptionFilter<T extends MongoServerError> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.BAD_REQUEST;

    const formattedError = formatMongoDispalyError(exception);

    const responseBody: IHttpResponse = {
      data: null,
      statusCode: status,
      timestamp: getCurrentUTCDate(),
      error: {
        logMessage: formattedError,
        displayMessage: errorMessage.DEFAULT_ERROR,
      },
    };

    response.status(status).json(responseBody);
  }
}
