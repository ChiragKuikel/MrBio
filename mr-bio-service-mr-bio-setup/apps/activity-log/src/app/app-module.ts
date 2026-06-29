import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app-controller';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '../external-lib/ioc/config-module';
import { LatencyLogModule } from '../external-lib/ioc/latency-log-module';
import { ActivityLogModule } from '../external-lib/ioc/activity-log-module';
import { ExternalLibModule } from '../external-lib/ioc/external-lib-module';
import { ExceptionLogModule } from '../external-lib/ioc/exception-log-module';
import { AuthenticationGuard, AuthorizationGuard, MongoDbModule } from '@mr-bio/core/external-lib';

@Module({
  controllers: [AppController],
  imports: [
    ActivityLogModule,
    ExceptionLogModule,
    LatencyLogModule,
    JwtModule,
    // DB module
    MongoDbModule,
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
