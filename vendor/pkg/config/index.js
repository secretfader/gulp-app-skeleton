var path      = require('path')
,   dotaccess = require('dotaccess')
,   dotenv    = require('dotenv')
,   extend    = require('lodash').extend;

dotenv.load();

/**
 * Setup the default environment, in case NODE_ENV
 * is empty/null.
 */
exports.default = 'development';

/**
 * Base configuration.
 */
exports.config = extend(dotenv, {
  port: 9292,
  root: process.cwd(),
  secret: 'xxxx',

  /**
   * Environment Checks
   */
  'development?': function () {
    if (!process.env.NODE_ENV ||
      ('development' === process.env.NODE_ENV)
    ) return true;

    return false;
  }(),
  'production?': function () {
    if (process.env.NODE_ENV &&
      ('production' === process.env.NODE_ENV)
    ) return true;

    if (process.env.NODE_ENV &&
      ('benchmark' === process.env.NODE_ENV)
    ) return true;

    return false;
  }(),
  'test?': function () {
    if (process.env.NODE_ENV &&
      ('test' === process.env.NODE_ENV)
    ) return true;

    return false;
  }()
});

/**
 * Development Environment
 */
exports.config.development = {
};

/**
 * Test Environment
 */
exports.config.test = {
};

/**
 * Production Environment
 */
exports.config.production = {
  port: process.env.PORT,
  db: {
    uri: process.env.MONGODB_URI
  }
};

/**
 * Retrieve Configuration Object
 */
exports.get = function (key) {
  var env = process.env.NODE_ENV || exports.default
  ,   val = dotaccess.get(exports.config[env], key);

  if (val) return val;

  return dotaccess.get(exports.config, key);
};
