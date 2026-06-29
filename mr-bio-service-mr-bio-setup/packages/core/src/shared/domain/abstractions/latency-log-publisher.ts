import { HttpRequest, HttpResponse } from '../types';

export abstract class LatencyLogPublisher {
  abstract publishApiRequestCompletionEvent(
    request: HttpRequest,
    response: HttpResponse,
    responseTimeMs: number
  ): void;
}
