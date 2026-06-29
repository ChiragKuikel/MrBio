import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { Anonymous } from '@mr-bio/core/external-lib';
import { APP_NAME, IHttpResponse, buildHttpResponse } from '@mr-bio/core/shared';

@Controller()
@ApiTags('App')
export class AppController {
  constructor() {}

  @Get('/communication/health')
  @Anonymous()
  getHealth(): IHttpResponse {
    return buildHttpResponse(null, `${APP_NAME} communication API up and running!`);
  }
}
