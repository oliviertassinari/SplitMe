'use strict';

var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

var dispatcher = require('Main/dispatcher');
var couchDBAction = require('Main/CouchDB/action');
var facebookStore = require('Main/Facebook/store');

var store = _.extend({}, EventEmitter.prototype, {
  get: function() {
    return null;
  },
  emitChange: function() {
    this.emit('change');
  },
  addChangeListener: function(callback) {
    this.on('change', callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  },
});

/**
 * Register callback to handle all updates
 */
dispatcher.register(function(action) {
  switch(action.actionType) {
    case 'COUCHDB_FETCH_USER':
      // TODO
      // var couchUrl = 'http://localhost:5984';
      // var serverUrl = 'http://localhost:3000';
      // auth : NEED npm pouchdbAuth
      // check user
      // if fail
      // call /signin NEED npm request

      // remoteDB1.replicate.to(localDB);
      // remoteDB2.replicate.to(localDB);
      // remoteDB3.replicate.to(localDB);

      // localDB.replicate.to(remoteDB1, {
      //   filter: function (doc) {
      //     return doc.share || indexOf;
      //   }
      // });
      //
      // Handle conflicts
      break;
  }
});

facebookStore.addChangeListener(function() {
  var facebook = facebookStore.get();

  if (facebook.get('me')) {
    couchDBAction.fetchUser();
  }
});

module.exports = store;
