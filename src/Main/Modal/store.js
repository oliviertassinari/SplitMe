'use strict';

var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

var dispatcher = require('../dispatcher');

var _modal = {
  actions: [],
  title: '',
};

var store = _.extend({}, EventEmitter.prototype, {
  getModal: function() {
    return _modal;
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
    case 'MODAL_UPDATE':
      _modal = action.modal;
      break;

    default:
      // no op
  }
});

module.exports = store;
