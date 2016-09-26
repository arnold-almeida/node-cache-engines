'use strict'

let objectAssign = require('object-assign')

// supported engines
let MemoryCache = require('./engines/Memory')
let RedisCache = require('./engines/Redis')

class CacheProfile {

  /**
   * Creates a new CacheProfile
   *
   * @param  {json} options
   *
   * @return {CacheProfile\Engine}
   */
  constructor (config) {
    this.default = {}
    this.default.expiresSecs = 60 * 5  // 5 mins

    if (!config) {
      return this.initDefault()
    }

    switch (config.engine) {
      case 'memory':
        return this.initMemory(config)
      case 'redis':
        return this.initRedis(config)
      default:
        throw new Error('Invalid config supplied. Engine [' + config.engine + ']')
    }
  }

  /**
   * Inits a default CacheProfile
   *
   * @return {CacheProfile\Engine\Memory}
   */
  initDefault () {
    let defaults = {
      name: 'memory-cache',
      expiresSecs: this.default.expiresSecs
    }
    return this.initMemory(defaults)
  }

  /**
   * Inits a CacheProfile with the Memory engine
   *
   * @return {CacheProfile\Engine\Memory}
   */
  initMemory (config) {
    return new MemoryCache(config)
  }

  /**
   * Inits a CacheProfile with the Redis engine
   *
   * @return {CacheProfile\Engine\Redis}
   */
  initRedis (config) {
    let defaults = {
      name: 'redis-cache',
      expiresSecs: this.default.expiresSecs,
      collection: 'default',
      redis: {
        port: 6379,
        host: '127.0.0.1',
        database: 1,
        prefix: 'cache-engine'
      }
    }

    return new RedisCache(objectAssign(defaults, config))
  }

}

module.exports = CacheProfile
