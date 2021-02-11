var routers = require('express').Router();

// Custom shared
const shared = require('@la-manicurista/shared');

/**
 * A tiny JavaScript debugging utility modelled after Node.js core's
 * debugging technique. Works in Node.js and web browsers.
 *
 * [debug](https://www.npmjs.com/package/debug)
 */
const debug = require('debug')(
  `${shared.APLICATION_DEBUG_NAME}:routes:typeahead.routes`
);

/**
 * Create HTTP errors for Express, Koa, Connect, etc. with ease.
 * [http-errors](https://github.com/jshttp/http-errors)
 */
const createError = require('http-errors');

/**
 * Class-transformer allows you to transform plain object to some instance
 * of class and versa. Also it allows to serialize / deserialize object
 * based on criteria. This tool is super useful on both frontend and backend.
 * [class-transformer](https://github.com/typestack/class-transformer#classtoplain)
 */
const classTransformer = require('class-transformer');

const typeaheadService = new shared.TypeaheadService();

function getTypeaheadPrefix(request, response, next) {
  const prefix = request.params.prefix;
  debug('getTypeaheadPrefix()', prefix ? 'prefix' : '', prefix || '');

  return typeaheadService
    .list(prefix)
    .toPromise()
    .then((users) => response.json(users))
    .catch((error) => createError(error.status, error.message));
}

routers
  .get(`/${shared.API_RESOURCES_PREFIX.TYPEAHEAD}`, getTypeaheadPrefix)
  .param('prefix', (request, response, next, prefix) => {
    // Validation pŕefix param
    debug('param()', 'prefix', prefix);

    try {
      new shared.PrefixPipe().transform(prefix);
      return next();
    } catch (error) {
      return next(
        createError(error.response.statusCode, error.response.message)
      );
    }
  })
  .get(`/${shared.API_RESOURCES_PREFIX.TYPEAHEAD}/:prefix`, getTypeaheadPrefix)
  .post(
    `/${shared.API_RESOURCES_PREFIX.TYPEAHEAD}`,
    (request, response, next) => {
      // Validation user body
      const user = request.body;
      debug('post()', 'validation', 'user', user);

      let userPipe = new shared.UserPipe(shared.USER_SCENARIOS.PREFIX);
      return userPipe
        .transform(request.body, { metatype: shared.UserModel })
        .then(() => next())
        .catch((error) => {
          debug('post()', 'validation', 'error', error);
          return next(
            createError(
              error.response.status,
              classTransformer.serialize(error.response.message)
            )
          );
        });
    },
    (request, response, next) => {
      const user = request.body;
      debug('post()', 'user', user);

      return typeaheadService
        .update(request.body)
        .toPromise()
        .then((users) => response.json(users))
        .catch((error) => {
          debug('post()', 'error', error);
          return next(createError(error.status, error.response));
        });
    }
  );

module.exports = routers;
