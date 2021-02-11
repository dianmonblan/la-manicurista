/**
 * Simple write-ahead API
 */

/**
 * A progressive Node.js framework for building efficient,
 * reliable and scalable server-side applications.
 * [nest](https://nestjs.com/)
 */
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { env } from 'process';

/**
 * Helmet helps you secure your Express apps by setting various
 * HTTP headers. It's not a silver bullet, but it can help!
 * [Helmet](https://github.com/helmetjs/helmet)
 */
import * as helmet from 'helmet';

/**
 * !ONLY PRODUCTION ENVIRONMENT¡
 *
 * PROVISIONALLY basic rate-limiting middleware for Express. Use to
 * limit repeated requests to public APIs and/or endpoints such as
 * password reset.
 * [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)
 */
import rateLimit from 'express-rate-limit';

// Custom shared
import { JSONPInterceptor, NODE_ENV } from '@la-manicurista/shared';

// Custom modules
import { AppModule } from './app/app.module';

// Custom persistent virtual storage
import { PersistentVirtualStorageSingleton } from '@la-manicurista/persistent-virtual-storage';

async function bootstrap() {
  const application: any = await NestFactory.create(AppModule);

  // API bind parameter prefix example http://localhost/api
  const GLOBAL_API_PREFIX: string = env.GLOBAL_API_PREFIX || '';

  // Application port
  const PORT: number = Number(env.PORT) || 3333;

  // Initialize persistent virtual storage
  PersistentVirtualStorageSingleton.connect(env.DATA_FILE_PATH);

  Logger.log(`GLOBAL_API_PREFIX:${GLOBAL_API_PREFIX}`, 'main:bootstrap');
  application.setGlobalPrefix(GLOBAL_API_PREFIX);
  application.use(helmet());

  /**
   * Minimum configuration CORS
   *
   * Cross-origin resource exchange (CORS) is a mechanism that allows
   * requesting resources from another domain by applying security
   * rules limiting global access.
   * [cors](https://github.com/expressjs/cors)
   */
  if (env.APPLICATION_API_CORS_ORIGIN) {
    Logger.log(
      `APPLICATION_API_CORS_ORIGIN:${env.APPLICATION_API_CORS_ORIGIN}`,
      'main:bootstrap'
    );

    /**
     * To enable CORS, call the enableCors() method on the Nest
     * application object.
     * [CORS](https://docs.nestjs.com/security/cors)
     */
    application.enableCors({
      origin: env.APPLICATION_API_CORS_ORIGIN,
    });
  }

  /**
   * !ONLY PRODUCTION ENVIRONMENT¡
   */
  if ([NODE_ENV.PRODUCTION.toString()].includes(String(env.NODE_ENV))) {
    Logger.log(`NODE_ENV:${env.NODE_ENV}`, 'main:bootstrap');

    /**
     * PROVISIONALLY basic rate-limiting middleware for Express. Use to
     * limit repeated requests to public APIs and/or endpoints such as
     * password reset.
     * [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)
     *
     * Apply to all requests
     * [Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
     * see `app.set('trust proxy', 1)`](https://expressjs.com/en/guide/behind-proxies.html)
     */
    application.use(
      rateLimit({
        windowMs: (Number(env.WINDOW_MS_RATE_LIMIT) || 15) * 60 * 1000, // Minutes
        max: Number(env.MAX_RATE_LIMIT) || 100, // Limit each IP to requests per windowMs
      })
    );

    /**
     * Security layer to avoid JSONP cross requests
     */
    application.useGlobalInterceptors(new JSONPInterceptor());
  }

  await application.listen(PORT, () => {
    Logger.log(
      `Listening at http://localhost:${PORT}/${GLOBAL_API_PREFIX}`,
      'main:bootstrap'
    );
  });
}

bootstrap();
