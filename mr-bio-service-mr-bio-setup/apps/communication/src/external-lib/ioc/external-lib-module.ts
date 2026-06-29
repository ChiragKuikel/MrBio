import { JwtModule } from '@nestjs/jwt';
import { Global, Module } from '@nestjs/common';
import { SERVICE_NAME } from '../../shared/constants';
import { SendGridHelper } from '../email/send-grid-helper';
import { TwilioSmsHelper } from '../sms/twilio-sms-helper';
import { SmsHelper } from '../../shared/abstractions/sms-helper';
import { EmailHelper } from '../../shared/abstractions/email-helper';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { JwtTokenHelperImpl, PinoLogger } from '@mr-bio/core/external-lib';
import { BaseConfigService, Logger, toKebabCase, TokenHelper } from '@mr-bio/core/shared';

@Global()
@Module({
  imports: [JwtModule],
  exports: [EmailHelper, TokenHelper, SmsHelper, Logger],
  providers: [
    {
      provide: TokenHelper,
      useClass: JwtTokenHelperImpl,
    },
    {
      provide: EmailHelper,
      useClass: SendGridHelper,
    },
    {
      provide: SmsHelper,
      useClass: TwilioSmsHelper,
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
