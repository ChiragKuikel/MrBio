import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AxiosHttpRequestHelper } from '../../http';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import {
  AuthClient,
  BaseConfigService,
  HttpRequest,
  HttpRequestHelper,
  isAuthEntityClient,
  Logger,
} from '../../../shared';

@Injectable()
export class UpdateTokenUsageInterceptor implements NestInterceptor {
  private httpRequestHelper: HttpRequestHelper;

  constructor(
    configService: BaseConfigService,
    private logger: Logger
  ) {
    this.httpRequestHelper = new AxiosHttpRequestHelper();
    this.httpRequestHelper.init(configService.app.userServiceUrl);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest() as HttpRequest;

    const authEntity = request.authEntity;

    return next.handle().pipe(
      tap(() => {
        const updateTokenUsage =
          !request.isUnprotected && !!authEntity && isAuthEntityClient(authEntity);

        if (updateTokenUsage) {
          this.logger.debug(
            `Updating token usage for client ${authEntity.id} with token ${authEntity.tokenId}`
          );
          this.updateTokenUsage(authEntity);
        }
      })
    );
  }

  async updateTokenUsage(authClient: AuthClient) {
    await this.httpRequestHelper
      .patch(`clients/${authClient.id}/token/${authClient.tokenId}/usage`)
      .catch(err => {
        this.logger.error(
          `Failed to update token usage for client ${authClient.id} with token ${authClient.tokenId}`,
          err
        );
      });
  }
}
