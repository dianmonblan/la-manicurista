/**
 * Simple write-ahead API
 */

/**
 * Prevent error 'Cannot redeclare block-scoped variable 'debug''
 *
 * Solution: Typescript is moduler and each module has it’s own block.
 */
export {};

// Custom shared
const shared = require('@la-manicurista/shared');

/**
 * A tiny JavaScript debugging utility modelled after Node.js core's
 * debugging technique. Works in Node.js and web browsers.
 * [debug](https://github.com/visionmedia/debug)
 */
const debug = require('debug')(`${shared.APLICATION_DEBUG_NAME}:main`);

// Application port
const PORT = Number(process.env.PORT) || 4444;

// API bind parameter prefix example http://localhost/api
const GLOBAL_API_PREFIX = process.env.GLOBAL_API_PREFIX || '';

const application = require('./application');

const server = application.listen(PORT, () =>
  debug(`Listening at http://localhost:${PORT}/${GLOBAL_API_PREFIX}`)
);
server.on('error', debug);
