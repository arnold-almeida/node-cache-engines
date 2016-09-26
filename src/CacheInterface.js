'use strict'
let debug = require('debug')('cache-engines:interface')

/**
 * NB: Not technically an interafce but what can we do (OᴥO)
 */
var CacheInterface = class CacheInterface {

  constructor (config) {}

  // ===========================================================================
  // API

  check (key) {}

  write (key, val) {}

  read (key) {}

  delete (key) {}
}

module.exports = CacheInterface
