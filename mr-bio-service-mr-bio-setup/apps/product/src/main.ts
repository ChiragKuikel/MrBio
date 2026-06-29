import { join } from 'path';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { Application } from '@mr-bio/core';
import { AppModule } from './app/app-module';
import { SERVICE_NAME } from './shared/constants';
import { getMongoModelsForRegistration } from './external-lib/mongo-db/register-models';

async function bootstrap() {
  const nestApp = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  nestApp.use(
    express.json({
      verify: (req: any, res, buf: Buffer) => {
        req.rawBody = buf.toString();
      },
    })
  );

  // ✅ Capture raw JSON body (before body-parser processes it)
  nestApp.use(
    express.json({
      verify: (req: any, res, buf: Buffer) => {
        req.rawBody = buf.toString();
      },
    })
  );

  // ✅ Log raw body for debugging
  nestApp.use((req, res, next) => {
    if (req.headers['content-type']?.includes('application/json')) {
      console.log('\n📥 Raw JSON Body:\n', req.rawBody, '\n');
    }
    next();
  });

  // Serve static files from assets/images directory
  nestApp.use('/assets/images', express.static(join(process.cwd(), 'assets/images')));

  // 👇 Initialize your app as usual
  const app = new Application(SERVICE_NAME, nestApp);

  await app.init({
    mongoDb: true,
    mongoModelsToRegsiter: getMongoModelsForRegistration(nestApp),
  });
}

//   const app = new Application(SERVICE_NAME, nestApp);

//   await app.init({
//     mongoDb: true,
//     mongoModelsToRegsiter: getMongoModelsForRegistration(nestApp),
//   });
// }

bootstrap();
