/**
 * Override the express response.json () method to provide a layer
 * of security on JSONP requests. The implementation is based on
 * the native method response.json () of express.
 *
 * Applying `APPLICATION_API_JSONP_JOKER` on the result of the J
 * SON response.
 *
 * [JSONP](https://es.wikipedia.org/wiki/JSONP)
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { env } from 'process';

/**
 * Class-transformer allows you to transform plain object to some instance
 * of class and versa. Also it allows to serialize / deserialize object
 * based on criteria. This tool is super useful on both frontend and backend.
 * [class-transformer](https://github.com/typestack/class-transformer#classtoplain)
 */
import { serialize } from 'class-transformer';

/**
 * A tiny JavaScript debugging utility modelled after Node.js core's
 * debugging technique. Works in Node.js and web browsers.
 *
 * [debug](https://www.npmjs.com/package/debug)
 */
import _debug from 'debug';

// Custom constants
import { APLICATION_DEBUG_NAME } from '../constants';

const debug: any = _debug(
  `${APLICATION_DEBUG_NAME}:interceptors:jsonp.interceptor.ts`
);

@Injectable()
export class JSONPInterceptor implements NestInterceptor<string, string> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<string>
  ): Observable<string> {
    debug('intercept()', 'context', context, 'next', next);

    return next
      .handle()
      .pipe(
        map(
          (data: any) =>
            `${env.APPLICATION_API_JSONP_JOKER || ''}${serialize(data)}`
        )
      );
  }
}
