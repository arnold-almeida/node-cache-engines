'use strict'
let debug = require('debug')('cache-engines:redis')
let bluebird = require('bluebird')
let redis = require('redis')

// promisfy
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

/**
 *
 */
class Redis {

  constructor (config) {
    debug(config)
    this.config = config
    this.init()
  }

  init () {
    let client = redis.createClient(
      this.config.redis.port,
      this.config.redis.host
    )

    client = this.createRedisClient(this.config.redis)
    this.client = client
  }

  createRedisClient (options) {
    let socket = options.socket
    let port = !socket ? (options.port || 6379) : null
    let host = !socket ? (options.host || '127.0.0.1') : null
    let client = redis.createClient(socket || port, host, options)

    // support redis auth
    if (options.auth) {
      client.auth(options.auth)
    }

    // support alt db selection
    if (options.db) {
      client.select(options.redis.db)
    }

    return client
  }

  /**
   * By default it will store in redis as
   *
   *   PREFIX:COLLECTION:KEY
   *
   *   redis-cache-engine:default:KEY
   *
   * @return {String} key
   */
  cleanKey (key) {
    return this.config.redis.prefix + ':' + this.config.collection + ':' + key
  }

  /**
   * Stats for each collection will be stored as
   *
   *   PREFIX:COLLECTION:STATS
   *
   *   redis-cache-engine:default:KEY
   *
   * @return {String} key
   */
  statsKey () {
    return this.config.redis.prefix + ':' + this.config.collection + ':stats'
  }

  /**
   * Check for the existence of a key in the defined CacheProfile
   *
   * @param {String}
   *
   * @return {Boolean}
   */
  check (key) {
    return this.client.hexistsAsync([this.cleanKey(key), 'data'])
      .then((reply) => {
        if (reply === 1) {
          return true
        }
        return false
      })
  }

  /**
   * Write a key to Cache
   *
   * @return {Object} val
   */
  write (key, val) {
    let lookupType = (typeof val)
    key = this.cleanKey(key)

    if (!key) {
      throw new Error('No key provided')
    }

    if (!val) {
      debug('No value supplied for key : ' + key + '. Skipping...')
    }

    if (['object', 'string'].indexOf(lookupType) === -1) {
      throw new Error('We dont know how to store type [' + lookupType + ']')
    }

    let store = {
      type: lookupType,
      data: (lookupType === 'object') ? JSON.stringify(val) : val
    }

    return this.client.hmsetAsync(key, store)
      .then((reply) => {
        if (reply === 'OK') {
          // async;
          this.expire(key, this.config.expiresSecs)
          return val
        }
      })
  }

  /**
   * Expire a key
   *
   * @param  {String} cleanKey
   * @param  {Integer} expiresInSecs
   */
  expire (cleanKey, expiresInSecs) {
    if (!expiresInSecs) {
      throw new Error('Please ensure that an expiry is set.')
    }

    return this.client.expireAsync(cleanKey, expiresInSecs)
  }

  /**
   * Read a key from Cache
   */
  read (key) {
    key = this.cleanKey(key)

    debug('cache.read()')
    debug(key)

    return this.client.hmgetAsync(key, ['type', 'data'])
      .then(function (reply) {
        let type = reply[0]
        let data = reply[1]

        if (type === 'object') {
          // convert back to object
          return JSON.parse(data)
        } else {
          // assume string
          return data
        }
      })
  }

  /**
   * Delete a key from Cache
   */
  delete (key) {
    throw new Error('TODO')
  }

}

module.exports = Redis
