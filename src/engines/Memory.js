'use strict'

let debug = require('debug')('cache-engines:memory')
let CacheInterface = require('../CacheInterface')

/**
 * NB: Not technically an interafce but what can we do (OᴥO)
 */
class Memory extends CacheInterface {

  constructor (config) {
    debug('Creating Memory cache with ')
    debug(config)

    super(config)
    this.init()
  }

  /**
   * Init the cache
   */
  init () {
    this.cache = {}
  }

  /**
   * Check for the existence of a key for the defined CacheProfile
   */
  check (key) {
    if (typeof (this.cache[key]) !== 'undefined') {
      return true
    }
  }

  /**
   * Write a key to Cache
   */
  write (key, val) {
    if (!key) {
      throw new Error('No cache key provided')
    }

    if (!val) {
      debug('No value supplied for key : ' + key + '. Skipping...')
    }

    // write to engine
    this.cache[key] = val

    return this.read(key)
  }

  /**
   * Read a key from Cache
   */
  read (key) {
    if (this.check(key)) {
      return this.cache[key]
    }
  }

  /**
   * Delete a key from Cache
   */
  delete (key) {
    console.log('@todo')
  }

}

module.exports = Memory
