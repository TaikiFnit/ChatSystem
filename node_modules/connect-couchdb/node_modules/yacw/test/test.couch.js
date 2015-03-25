var couch = require('../')
  , assert = require('assert')
  , fs = require('fs')
  , global_opts = {}
  //  We keep a separate set of global options that use uri.
  , global_opts_with_uri = {};

if (fs.existsSync('./test/credentials.json')) {
  var credentials = require('./credentials.json');
  global_opts.username = credentials.username;
  global_opts.password = credentials.password;
  global_opts_with_uri.uri = credentials.uri;
}

describe('yacw', function () {
  it('create & delete database', function (done) {
    var opts = global_opts;
    opts.name = 'yacw-create';
    var db = new couch(opts);
    db.dbPut(function (err, res) {
      assert.strictEqual(err, null);
      db.dbDel(function (err, res) {
        assert.strictEqual(err, null);
        done();
      });
    });
  });
  it('create & delete database with uri', function (done) {
    var opts = {
      uri: (global_opts_with_uri.uri || 'http://127.0.0.1:5984') + '/yacw-create-with-uri'
    };
    var db = new couch(opts);
    db.dbPut(function (err, res) {
      assert.strictEqual(err, null);
      db.dbDel(function (err, res) {
        assert.strictEqual(err, null);
        done();
      });
    });
  });
  it('db name', function () {
    assert.throws(function () {
      new couch();
    });
  });
  it('database _revs_limit option', function (done) {
    var opts = global_opts;
    opts.name = 'yacw-option';
    var db = new couch(opts);
    db.dbPut(function (err, res) {
      db.putOpt('_revs_limit', '1', function(err, res) {
        assert.strictEqual(err, null);
        db.getOpt('_revs_limit', function (err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res, 1);
          done();
        });
      });
    });
  });
  it('create & remove document', function (done) {
    var opts = global_opts;
    opts.name = 'yacw-create-doc';
    var db = new couch(opts);
    db.dbPut(function (err, res) {
      db.put({_id: "qsd", aze: 3}, function (err, res) {
        assert.strictEqual(err, null);
        assert.strictEqual(res.id, 'qsd');
        assert.strictEqual(res.ok, true);
        assert.notEqual(res._rev, undefined);
        db.del({_id: res.id, _rev: res._rev}, function (err, res) {
          assert.strictEqual(err, null);
          done();
        });
      });
    });
  });
  it('get & update document', function (done) {
    var opts = global_opts;
    opts.name = 'yacw-update-doc';
    var db = new couch(opts);
    db.dbPut(function (err, res) {
      db.put({_id: "wxc", aze: 4}, function (err, res) {
        db.get("wxc", function (err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res._id, 'wxc');
          assert.strictEqual(res.aze, 4);
          assert.notEqual(res._rev, undefined);
          db.put({_id: "wxc", _rev: res._rev, aze: 5}, function (err, res) {
            assert.strictEqual(err, null);
            db.get("wxc", function (err, res) {
              assert.strictEqual(err, null);
              assert.strictEqual(res._id, 'wxc');
              assert.strictEqual(res.aze, 5);
              assert.notEqual(res._rev, undefined);
              db.head("wxc", function (err, res_head) {
                assert.strictEqual(err, null);
                assert.strictEqual(res._id, res_head._id);
                assert.strictEqual(res._rev, res_head._rev);
                db.del({_id: res._id, _rev: res._rev}, function (err, res) {
                  assert.strictEqual(err, null);
                  done();
                });
              });
            });
          });
        });
      });
    });
  });
  it('create document with post & views', function (done) {
    var opts = global_opts;
    opts.name = 'yacw-create-view';
    var db = new couch(opts);
    db.dbPut(function (err, res) {
      db.putDesignDocs([__dirname + '/view.json'], function (err) {
        assert.strictEqual(err, null);
        db.post({doc: {type: 'test'}}, function (err, res) {
          assert.strictEqual(err, null);
          db.view('_design/test/_view/empty-view', {}, function (err, docs) {
            assert.strictEqual(err, null);
            assert.strictEqual(docs.total_rows, 0);
            done();
          });
        });
      });
    });
  });
  it('bulk documents', function (done) {
    var opts = global_opts;
    opts.name = 'yacw-bulk-doc';
    var db = new couch(opts);
    db.dbPut(function (err, res) {
      db.put({_id: "aze", aze: 4}, function (err, res) {
        assert.strictEqual(err, null);
        var rev = res._rev;
        db.put({_id: "wxc", wxc: 4}, function (err, res) {
          assert.strictEqual(err, null);
          db.bulk({docs:[{_id: "aze", _rev: rev, aze: 5},
                         {_id: "wxc", _rev: res._rev, wxc: 5}]}, function (err, res) {
            assert.strictEqual(err, null);
            db.get("aze", function (err, res) {
              assert.strictEqual(err, null);
              assert.strictEqual(res._id, 'aze');
              assert.strictEqual(res.aze, 5);
              db.get("wxc", function (err, res) {
                assert.strictEqual(err, null);
                assert.strictEqual(res._id, 'wxc');
                assert.strictEqual(res.wxc, 5);
                done();
              });
            });
          });
        });
      });
    });
  });
});
