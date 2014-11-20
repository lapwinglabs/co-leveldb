/**
 * Module Dependencies
 */

var yieldly = require('yieldly');

/**
 * Export `level`
 */

module.exports = level;

/**
 * Methods to wrap
 */

var wrap = [
  'approximateSize',
  'open',
  'close',
  'put',
  'del'
];

/**
 * Initialize `level`
 */

function level(db) {
  var batch = db.batch;
  var get = db.get;

  // wrap batch differently
  db.batch = function(ops) {
    if (ops) return yieldly(batch).call(db, ops);
    var b = batch.call(db);
    b.write = yieldly(b.write);
    return b;
  }

  // custom get to return null if err.notFound
  db.get = yieldly(function(key, options, fn) {
    if ('function' == typeof options) fn = options, options = {};
    get.call(db, key, options, function(err, v) {
      if (err) return err.notFound ? fn(null, null) : fn(err);
      return fn(null, v);
    });
  });

  // wrap functions
  wrap.forEach(function(method) {
    if (!db[method]) return;
    db[method] = yieldly(db[method]);
  });

  return db;
}
