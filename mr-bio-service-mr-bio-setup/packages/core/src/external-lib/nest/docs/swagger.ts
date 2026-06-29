import { INestApplication } from '@nestjs/common';
import { APP_NAME } from '../../../shared/domain/constants';
import { BaseConfigService, toKebabCase } from '../../../shared';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function createSwaggerDocument(app: INestApplication<any>, microserviceName: string) {
  const configService = app.get(BaseConfigService);

  const documentBuilder = new DocumentBuilder()
    .setTitle(`${APP_NAME} ${microserviceName} API`)
    .setDescription(`${APP_NAME} ${microserviceName} API`)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Access token',
      },
      'JWT'
    );

  if (configService.app.swaggerApiBaseUrl) {
    documentBuilder.addServer(configService.app.swaggerApiBaseUrl);
  }

  const config = documentBuilder.build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`api/${toKebabCase(microserviceName)}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
