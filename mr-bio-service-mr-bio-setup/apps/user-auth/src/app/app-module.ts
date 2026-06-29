import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app-controller';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { UserModule } from '../external-lib/ioc/user-module';
import { ConfigModule } from '../external-lib/ioc/config-module';
import { ClientModule } from '../external-lib/ioc/client-module';
import { AuthenticationModule } from '../external-lib/ioc/auth-module';
import { ExternalLibModule } from '../external-lib/ioc/external-lib-module';
import { AuthorizationModule } from '../external-lib/ioc/authorization-module';
import {
  AuthenticationGuard,
  AuthorizationGuard,
  ChangeStreamModule,
  MongoDbModule,
  LoggerModule,
} from '@mr-bio/core/external-lib';

@Module({
  controllers: [AppController],
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
  imports: [
    UserModule,
    AuthenticationModule,
    AuthorizationModule,
    ClientModule,
    JwtModule,
    LoggerModule,
    // DB module
    MongoDbModule,
    ChangeStreamModule,
    // config module
    ConfigModule,
    // infrastructure module
    ExternalLibModule,
  ],
})
export class AppModule {}
