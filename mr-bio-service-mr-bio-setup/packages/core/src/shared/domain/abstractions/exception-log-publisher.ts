import { HttpRequest, HttpResponse } from '../types';

export abstract class ExceptionLogPublisher {
  abstract publishExceptionEvent(
    request: HttpRequest,
    response: HttpResponse,
    message: string,
    error?: Error
  ): void;
}
