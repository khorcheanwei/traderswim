const memcache = require('memcache');

// Create a singleton instance of Memcached
const memcached = new memcache.Client('localhost:11211');
//
module.exports = memcached;