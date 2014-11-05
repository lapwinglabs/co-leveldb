/**
 * Module Dependencies
 */

var yieldly = require('yieldly');
var Level = require('level-11');
var co = require('co');

/**
 * Export `leveldb`
 */

module.exports = leveldb;

/**
 * Yieldly
 */

Level.destroy = yieldly(Level.destroy);
Level.repair = yieldly(Level.repair);

/**
 * Initialize `leveldb`
 */

function leveldb(location, options, callback) {
  var level = Level(location, options, callback);
  level.approximateSize = yieldly(level.approximateSize);
  level.batch = yieldly(level.batch);
  level.close = yieldly(level.close);
  level.open = yieldly(level.open);
  level.get = yieldly(level.get);
  level.put = yieldly(level.put);
  level.del = yieldly(level.del);
  return level;
}
