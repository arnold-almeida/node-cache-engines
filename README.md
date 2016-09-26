# node-cache-engines

A caching lib with simple interface with support for mutiple engines

## Installation

    npm install node-cache-engines --save

## Usage

```javascript
let CacheProfile = require('node-cache-engines');

let Cache = new CacheProfile()
let key = 'SOME-KEY'
let data = [
    {
        firstName: 'John'
        lastName: 'Doe'
    },
    {
        firstName: 'Jane'
        lastName: 'Doe'
    },
]

function listUsers () {

    // Is the object already in the cache ?
    if (Cache.check(cacheKey)) {

        // read it out skip any code
        Cache.read(cacheKey)
    }

    // write it to the cache for next time
    Cache.write(cacheKey, data)

    return data
}

listUsers(data)
```


## API

### check = function(key)

### read = function(key)

### write = function(key, val)

### delete = function(key)

Deletes a key out of the cache.

### reset = function()

Clear the cache entirely, throwing away all values.

### hits = function()

### misses = function()

### keys = function()


## Note on Patches/Pull Requests

* Fork the project.
* Make your feature addition or bug fix.
* Send me a pull request.
