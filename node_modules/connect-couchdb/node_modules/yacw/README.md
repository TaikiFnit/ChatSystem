Yet Another CouchDB Wrapper
===
[![Build Status](https://secure.travis-ci.org/tdebarochez/yacw.png)](http://travis-ci.org/tdebarochez/yacw)
Extract from [connect-couchdb middleware](https://github.com/tdebarochez/connect-couchdb)

API
---

Constructor :

    Couch = function (config) {}

Default config (`name` is required) :

    {name: '<your_database_name>',
     host: "127.0.0.1",
     port: 5984,
     username: '',
     password: '',
     ssl: false}

Alternative config with `uri` of your CouchDb database :

    {uri: 'http://127.0.0.1:5984/<your_database_name>'}

When `uri` is defined all other properties are ignored and can be left out, including `name`.

Database options :

    Couch.prototype.putOpt = function(field, value, callback) {}
    Couch.prototype.getOpt = function(field, callback) {}

Records management :

    Couch.prototype.put = function(doc, callback) {}
    Couch.prototype.post = function(doc, callback) {}
    Couch.prototype.del = function(doc, callback) {}
    Couch.prototype.get = function(id, callback) {}
    Couch.prototype.head = function(id, callback) {}
    Couch.prototype.bulk = function({docs: [...]}, callback) {}

Views management :

    Couch.prototype.view = function(view, options, callback) {}
    Couch.prototype.putDesignDocs = function(files, callback) {}

Database management :

    Couch.prototype.dbPut = function(callback) {}
    Couch.prototype.dbDel = function(callback) {}
