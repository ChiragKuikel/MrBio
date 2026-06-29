import { JwtModule } from '@nestjs/jwt';
import { Global, Module } from '@nestjs/common';
import { SERVICE_NAME } from '../../shared/constants';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { JwtTokenHelperImpl, LoggerModule, PinoLogger } from '@mr-bio/core/external-lib';
import { BaseConfigService, Logger, toKebabCase, TokenHelper } from '@mr-bio/core/shared';

@Global()
@Module({
  exports: [Logger, TokenHelper],
  imports: [JwtModule, LoggerModule],
  providers: [
    {
      provide: TokenHelper,
      useClass: JwtTokenHelperImpl,
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
  ],
})
export class ExternalLibModule {}
