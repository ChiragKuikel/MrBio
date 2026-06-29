import { join } from 'path';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app-controller';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { OrderModule } from '../external-lib/ioc/order-module';
import { ConfigModule } from '../external-lib/ioc/config-module';
import { ProductModule } from '../external-lib/ioc/product-module';
import { CategoryModule } from '../external-lib/ioc/category-module';
import { AddToCartModule } from '../external-lib/ioc/add-to-cart-module';
import { ExternalLibModule } from '../external-lib/ioc/external-lib-module';
import {
  AuthenticationGuard,
  AuthorizationGuard,
  ChangeStreamModule,
  LoggerModule,
  MongoDbModule,
} from '@mr-bio/core/external-lib';

@Module({
  controllers: [AppController],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'assets', 'images'),
      serveRoot: '/images',
    }),
    ProductModule,
    CategoryModule,
    AddToCartModule,
    OrderModule,
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
export class AppModule {
  constructor() {
    console.log('__dirname:', __dirname);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const path1 = join(__dirname, 'assets', 'images');
    const path2 = join(__dirname, '../../../..', 'uploads', 'images');

    console.log(`Path 1 exists (${path1}):`, fs.existsSync(path1));
    console.log(`Path 2 exists (${path2}):`, fs.existsSync(path2));

    console.log(
      'Serving static files from:',
      join(process.cwd(), 'apps', 'product', 'assets', 'images')
    );

    const staticPath = join(__dirname, '..', '..', '..', '..', 'assets', 'images');
    console.log('Final static path:', staticPath, 'Exists:', fs.existsSync(staticPath));
  }
}
