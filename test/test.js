var co = require('co');
var wrap = require('../');
var MemDB = require('memdb');
var Stream = require('stream');
var assert = require('assert');

var db = wrap(MemDB());

describe('co-level', function(){
  it('should put and get', function(done){
    co(function*(){
      yield db.put('foo', 'bar');
      yield db.put('bar', 'baz');
      var res = yield db.get('foo');
      assert.equal(res, 'bar');
    })(done);
  });

  it('should del', function(done){
    co(function*(){
      yield db.put('key', 'value');
      yield db.del('key');
      try {
        yield db.get('key');
        throw new Error('did not throw');
      } catch (e) {}
    })(done);
  });

  it('should support array batch', function(done){
    co(function*(){
      yield db.batch([
        { type: 'put', key: 'yolo', value: 'swag' },
        { type: 'put', key: 'whatever', value: 'fun' }
      ]);

      res = yield db.get('yolo');
      assert.equal(res, 'swag');
      res = yield db.get('whatever');
      assert.equal(res, 'fun');
    })(done);
  });

  it('should support chained batch', function(done){
    co(function*(){
      yield db.batch()
        .put('swag', 'yolo')
        .write();

      res = yield db.get('swag');
      assert.equal(res, 'yolo');
    })(done);
  });

  it('should create streams', function(){
    assert(db.createReadStream() instanceof Stream);
  });

  it('should support callbacks', function(done) {
    db.put('foo', 'bar', function(err) {
      assert(!err);
      db.get('foo', function(err, val) {
        assert(!err);
        assert('bar' == val);
        done();
      });
    });
  });
});
