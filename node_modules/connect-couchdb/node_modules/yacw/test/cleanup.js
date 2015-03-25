var Couch = require('..');

var databases = ['yacw-create',
                 'yacw-create-with-uri',
                 'yacw-option',
                 'yacw-create-doc',
                 'yacw-update-doc',
                 'yacw-create-view',
                 'yacw-bulk-doc'];
databases.forEach(function (database_name) {
  (new Couch({name: database_name})).dbDel();
});
