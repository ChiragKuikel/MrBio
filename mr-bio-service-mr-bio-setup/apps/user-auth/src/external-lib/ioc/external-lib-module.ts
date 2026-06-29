import { JwtModule } from '@nestjs/jwt';
import { Global, Module } from '@nestjs/common';
import { SERVICE_NAME } from '../../shared/constants';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { NetworkServiceClient } from '../../shared/abstractions/network-service-client';
import { NetworkServiceClientImpl } from '../service-client/network-service-client-impl';
import {
  CookieHelperImpl,
  CryptoHelperImpl,
  JwtTokenHelperImpl,
  MongoDbUnitOfWorkImpl,
  PinoLogger,
} from '@mr-bio/core/external-lib';
import {
  ActivityLogPublisher,
  ActivityLogPublisherImpl,
  BaseConfigService,
  CookieHelper,
  CryptoHelper,
  EntityActivityLogPublisherFactory,
  Logger,
  TokenHelper,
  UnitOfWork,
  toKebabCase,
} from '@mr-bio/core/shared';

@Global()
@Module({
  imports: [JwtModule],
  exports: [
    // KAFKA_CLIENT_NAME,
    TokenHelper,
    CryptoHelper,
    CookieHelper,
    UnitOfWork,
    Logger,
    ActivityLogPublisher,
    EntityActivityLogPublisherFactory,
    NetworkServiceClient,
  ],
  providers: [
    {
      provide: TokenHelper,
      useClass: JwtTokenHelperImpl,
    },
    {
      provide: CryptoHelper,
      useClass: CryptoHelperImpl,
    },
    {
      provide: CookieHelper,
      useClass: CookieHelperImpl,
    },
    {
      provide: UnitOfWork,
      useClass: MongoDbUnitOfWorkImpl,
    },
    {
      provide: Logger,
      useClass: PinoLogger,
    },
    // {
    //   provide: KAFKA_CLIENT_NAME,
    //   inject: [BaseConfigService],
    //   useFactory: (configService: BaseConfigService) => {
    //     return ClientProxyFactory.create({
    //       transport: Transport.KAFKA,
    //       options: {
    //         producer: { allowAutoTopicCreation: true },
    //         consumer: { groupId: toKebabCase(SERVICE_NAME) },
    //         client: {
    //           clientId: toKebabCase(SERVICE_NAME),
    //           brokers: configService.kafka.brokers,
    //         },
    //       },
    //     });
    //   },
    // },
    {
      provide: ActivityLogPublisher,
      useClass: ActivityLogPublisherImpl,
    },
    EntityActivityLogPublisherFactory,

    {
      provide: NetworkServiceClient,
      useClass: NetworkServiceClientImpl,
    },
    // {
    //   provide: Cache,
    //   useClass: RedisCacheImpl,
    // },
  ],
})
export class ExternalLibModule {}
