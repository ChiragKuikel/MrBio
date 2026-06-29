import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { Anonymous } from '@mr-bio/core/external-lib';
import { APP_NAME, IHttpResponse, buildHttpResponse } from '@mr-bio/core/shared';

@Controller()
@ApiTags('App')
export class AppController {
  constructor() {}

  @Get('/user-auth/health')
  @Anonymous()
  getHealth(): IHttpResponse {
    return buildHttpResponse(null, `${APP_NAME} user auth API up and running! v2`);
  }
}
