import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app-controller';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '../external-lib/ioc/config-module';
import { ExternalLibModule } from '../external-lib/ioc/external-lib-module';
import { CommunicationModule } from '../external-lib/ioc/communication-module';
import {
  AuthenticationGuard,
  AuthorizationGuard,
  MongoDbModule,
  LoggerModule,
} from '@mr-bio/core/external-lib';

@Module({
  controllers: [AppController],
  imports: [
    CommunicationModule,
    JwtModule,
    // DB module
    MongoDbModule,
    LoggerModule,
    // config module
    ConfigModule,
    // infrastructure module
    ExternalLibModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
