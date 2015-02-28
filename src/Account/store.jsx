'use strict';

var _ = require('underscore');

var dispatcher = require('../dispatcher');
var EventEmitter = require('events').EventEmitter;
var PouchDB = require('pouchdb');

var db = new PouchDB('split');

var _accounts = [];
var _accountCurrent = null;

function fetchAll() {
  return new PouchDB('split').destroy().then(function() {
    return new PouchDB('split');
  }).then(function (db) {
    return db.put({
      _id: new Date().toJSON(),
      name: 'Croatie',
    }).then(function() {
      return db.allDocs({
        include_docs: true
      });
    }).then(function (result) {
      var rows = _.map(result.rows, function(row) {
        return row.doc;
      });
      return rows;
    }).catch(function (err) {
      console.log(err);
    });    
  });
}

function create(text) {
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _accounts[id] = {
    id: id,
    complete: false,
    text: text
  };
}

function update(id, updates) {
  _accounts[id] = _.extend({}, _accounts[id], updates);
}

function updateAll(updates) {
  for (var id in _accounts) {
    update(id, updates);
  }
}

function destroy(id) {
  delete _accounts[id];
}

function destroyCompleted() {
  for (var id in _accounts) {
    if (_accounts[id].complete) {
      destroy(id);
    }
  }
}

var store = _.extend({}, EventEmitter.prototype, {
  getAll: function() {
    return _accounts;
  },
  getCurrent: function() {
    return _accountCurrent;
  },
  emitChange: function() {
    this.emit('change');
  },
  addChangeListener: function(callback) {
    this.on('change', callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  }
});

/**
 * Register callback to handle all updates
 */
dispatcher.register(function(action) {
  switch(action.actionType) {
    case 'ACCOUNT_FETCH_ALL':
      fetchAll().then(function(result) {
        _accounts = result;
        store.emitChange();
      });
      break;

    case 'ACCOUNT_TAP':
      console.log('ACCOUNT_TAP');
      break;

    default:
      // no op
  }
});

module.exports = store;
