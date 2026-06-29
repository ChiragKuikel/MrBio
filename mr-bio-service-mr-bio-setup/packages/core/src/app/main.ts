import compression from 'compression';
import cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import { patchNestJsSwagger } from 'nestjs-zod';
import { INestApplication } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ZodExceptionFilter } from '../external-lib/nest/filters/zod-exception-filter';
import { LatencyLogPublisherImpl } from '../shared/messaging/latency-log-publisher-impl';
import { MongoDBExceptionFilter } from '../external-lib/nest/filters/mongo-exception-filter';
import { ExceptionLogPublisherImpl } from '../shared/messaging/exception-log-publisher-impl';
import { DomainExceptionFilter } from '../external-lib/nest/filters/domain-exception-filter';
import { DefaultExceptionFilter } from '../external-lib/nest/filters/default-exception-filter';
import { HttpResponseInterceptor } from '../external-lib/nest/interceptors/http-response-interceptor';
import {
  APP_NAME,
  ApplicationInitConfig,
  BaseConfigService,
  HttpRequest,
  Logger,
  NextFunction,
  UpdateTokenUsageInterceptor,
  createSwaggerDocument,
  registerMongoConnection,
  toKebabCase,
} from '..';

export class Application {
  constructor(
    private microserviceName: string,
    private app: INestApplication
  ) {}

  async init(config?: ApplicationInitConfig) {
    this.app.setGlobalPrefix('api');

    this.attachInterceptors();

    this.app.useGlobalFilters(
      new DefaultExceptionFilter(this.app.get(ExceptionLogPublisherImpl)),
      new MongoDBExceptionFilter(),
      new ZodExceptionFilter(),
      new DomainExceptionFilter()
    );

    this.app.use(cookieParser());
    this.app.use(compression()); //compresses responses with size > 1kb by default

    patchNestJsSwagger();
    createSwaggerDocument(this.app, this.microserviceName);

    await this._initDatabase(config);
    this._initMicroservice(config);

    this.app.use(this.responseTimeMiddleware.bind(this));
    await this._listen(config);
  }

  private async _initDatabase(config?: ApplicationInitConfig) {
    if (config?.mongoDb) {
      await registerMongoConnection(this.app, config.mongoModelsToRegsiter);
    }
  }

  private _initMicroservice(config?: ApplicationInitConfig) {
    // if (config?.microservice) {
    //   const config = this.app.get(BaseConfigService);
    //   this.app.connectMicroservice<MicroserviceOptions>({
    //     transport: Transport.KAFKA,
    //     options: {
    //       subscribe: { fromBeginning: true },
    //       producer: { allowAutoTopicCreation: true },
    //       consumer: { groupId: toKebabCase(this.microserviceName) },
    //       client: {
    //         brokers: config.kafka.brokers,
    //         clientId: toKebabCase(this.microserviceName),
    //       },
    //     },
    //   });
    // }
  }

  private async _listen(config?: ApplicationInitConfig) {
    const configService = this.app.get(BaseConfigService);
    await this.app.listen(configService.app.port);

    const logger = this.app.get(Logger);
    logger.info(
      `${APP_NAME} ${this.microserviceName} Service listening on port ${configService.app.port}`
    );

    if (config?.microservice) {
      await this.app.startAllMicroservices();
    }
  }

  private attachInterceptors() {
    const configService = this.app.get(BaseConfigService);
    const logger = this.app.get(Logger);
    this.app.useGlobalInterceptors(new UpdateTokenUsageInterceptor(configService, logger));
    this.app.useGlobalInterceptors(new HttpResponseInterceptor());
  }

  private async responseTimeMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const start = Date.now();
    const logger = this.app.get(Logger);
    const latencyLogger = this.app.get(LatencyLogPublisherImpl);
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`*** [${req.method}] ${req.originalUrl} - ${duration}ms ***`);
      latencyLogger.publishApiRequestCompletionEvent(req as HttpRequest, res, duration);
    });
    next();
  }
}
