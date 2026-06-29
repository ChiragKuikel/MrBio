import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { SERVICE_NAME } from '../shared/constants';
import { Anonymous } from '@mr-bio/core/external-lib';
import { APP_NAME, IHttpResponse, buildHttpResponse } from '@mr-bio/core/shared';

@Controller()
@ApiTags('App')
export class AppController {
  constructor() {}

  @Get('/product/health')
  @Anonymous()
  getHealth(): IHttpResponse {
    return buildHttpResponse(null, `${APP_NAME} ${SERVICE_NAME} API up and running!`);
  }
}
