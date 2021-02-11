/**
 * Fast, unopinionated, minimalist web framework for Node.js
 * [express](https://expressjs.com/)
 */
const application = require('express')();

/**
 * Create HTTP errors for Express, Koa, Connect, etc. with ease.
 * [http-errors](https://github.com/jshttp/http-errors)
 */
const createError = require('http-errors');

// Custom shared
const shared = require('@la-manicurista/shared');

/**
 * A tiny JavaScript debugging utility modelled after Node.js core's
 * debugging technique. Works in Node.js and web browsers.
 * [debug](https://github.com/visionmedia/debug)
 */
const debug = require('debug')(`${shared.APLICATION_DEBUG_NAME}:application`);

/**
 * Parse incoming request bodies in a middleware before your handlers,
 * available under the req.body property.
 * [body-parser](https://github.com/expressjs/body-parser)
 */
const bodyParser = require('body-parser');

// API bind parameter prefix example http://localhost/api
const GLOBAL_API_PREFIX = process.env.GLOBAL_API_PREFIX || '';

// Initialize persistent virtual storage
const {
  PersistentVirtualStorageSingleton,
} = require('@la-manicurista/persistent-virtual-storage');
PersistentVirtualStorageSingleton.connect(process.env.DATA_FILE_PATH);

/**
 * Minimum configuration CORS
 *
 * Cross-origin resource exchange (CORS) is a mechanism that allows
 * requesting resources from another domain by applying security
 * rules limiting global access.
 * [cors](https://github.com/expressjs/cors)
 */
if (process.env.APPLICATION_API_CORS_ORIGIN) {
  debug('APPLICATION_API_CORS_ORIGIN', process.env.APPLICATION_API_CORS_ORIGIN);
  application.use(
    require('cors')({
      origin: process.env.APPLICATION_API_CORS_ORIGIN,
    })
  );
}

/**
 * !ONLY PRODUCTION ENVIRONMENT¡
 */
if ([shared.NODE_ENV.PRODUCTION].includes(process.env.NODE_ENV)) {
  debug('NODE_ENV', process.env.NODE_ENV);

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
    require('express-rate-limit')({
      windowMs: (Number(process.env.WINDOW_MS_RATE_LIMIT) || 15) * 60 * 1000, // Minutes
      max: Number(process.env.MAX_RATE_LIMIT) || 100, // Limit each IP to requests per windowMs
    })
  );

  /**
   * Security layer to avoid JSONP cross requests
   */
  application.use(require('./app/middlewares').jsonp);
}

/**
 * Helmet helps you secure your Express apps by setting various
 * HTTP headers. It's not a silver bullet, but it can help!
 * [Helmet](https://github.com/helmetjs/helmet)
 */
application.use(require('helmet')());

// Parse application/x-www-form-urlencoded
application.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
application.use(bodyParser.json());

// Custom routes
application.use(`/${GLOBAL_API_PREFIX}`, require('./app/routes'));

// Catch 404 and forward to error handler
application.use((request, response, next) => next(createError(404)));

// Error handler
application.use((error, request, response, next) => {
  response
    .status(error.status || 500)
    .send(error.message || 'Resource not found');
});

module.exports = application;
