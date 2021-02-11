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

// Custom shared
const shared = require('@la-manicurista/shared');

/**
 * A tiny JavaScript debugging utility modelled after Node.js core's
 * debugging technique. Works in Node.js and web browsers.
 *
 * [debug](https://www.npmjs.com/package/debug)
 */
const debug = require('debug')(
  `${shared.APLICATION_DEBUG_NAME}:middlewares:jsonp.middleware`
);

/**
 * With great modules comes great responsibility; mark things deprecated!
 * [depd](https://github.com/dougwilson/nodejs-depd)
 */
const deprecate = require('depd')('express');

module.exports = function (request, response, next) {
  debug('Middleware evitar vulnerabilidad JSONP');

  response.json = function (data) {
    debug('Dentro de funcionRespuestaJson');

    // Allows state / body
    if (arguments.length === 2) {
      // res.json(body, status) backwards compat
      if (typeof arguments[1] === 'number') {
        deprecate(
          'res.json(obj, status): Use res.status(status).json(obj) instead'
        );
        this.statusCode = arguments[1];
      } else {
        deprecate(
          'res.json(status, obj): Use res.status(status).json(obj) instead'
        );
        this.statusCode = arguments[0];
        data = arguments[1];
      }
    }

    // Settings
    var application = this.app;
    const replace = application.get('json replacer');
    const spaces = application.get('json spaces');
    var body;

    if (replace || spaces) body = JSON.stringify(data, replace, spaces);
    else body = JSON.stringify(data);

    // Type of content
    if (!this.get('Content-Type')) this.set('Content-Type', 'application/json');

    return this.send(
      [process.env.APPLICATION_API_JSONP_JOKER || '', body].join('')
    );
  };

  next();
};
