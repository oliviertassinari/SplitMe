'use strict';

var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

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

facebookStore.addChangeListener(function() {
  console.log('change');
});

// remoteDB1.replicate.to(localDB);
// remoteDB2.replicate.to(localDB);
// remoteDB3.replicate.to(localDB);

// localDB.replicate.to(remoteDB1, {
//   filter: function (doc) {
//     return doc.shouldBeReplicated;
//   }
// });

module.exports = store;
