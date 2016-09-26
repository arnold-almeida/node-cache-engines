# node-cache-engines

A caching lib with simple interface with support for mutiple engines

## Installation

    npm install node-cache-engines --save

## Usage

```javascript
// config/cache-profile.js
'use strict'
let CacheProfile = require('node-cache-engines')

// Configure all your CacheProfiles
module.exports = {
  'RedisCache': new CacheProfile({
    engine: 'redis',
    collection: 'default',
    expiresSecs: 60 * 60 * 48 // 48 hrs
  })
}

```

```javascript
// some-service.js

let RedisCache = require('../config/cache').RedisCache
let key = '123'

// Check if key exists in the cache
if (RedisCache.check(key)) {
  return RedisCache.read(key)
}

// do work to get your data...
return RedisCache.write(key, data)

```

## Cache interface

## check = function(key)

## read = function(key)

## write = function(key, val)

## delete = function(key)

Deletes a key out of the cache.

## reset = function()

Clear the cache entirely, throwing away all values.

## hits = function()

## misses = function()

## keys = function()


## Note on Patches/Pull Requests

* Fork the project.
* Make your feature addition or bug fix.
* Send me a pull request.
