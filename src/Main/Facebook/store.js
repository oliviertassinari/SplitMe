'use strict';

var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

var facebook = require('facebook');
var dispatcher = require('Main/dispatcher');

var _response = {};

var store = _.extend({}, EventEmitter.prototype, {
  get: function() {
    return _response;
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
    case 'FACEBOOK_LOGIN':
      facebook().then(function(facebookConnectPlugin) {
        facebookConnectPlugin.login(['public_profile', 'email'], function(response) {
          _response = response;
          store.emitChange();
        }, function(error) {
          console.warn(error);
        });
      });
      break;

    case 'FACEBOOK_UPDATE_LOGIN_STATUS':
      facebook().then(function(facebookConnectPlugin) {
        facebookConnectPlugin.getLoginStatus(function(response) {
          _response = response;
          store.emitChange();
        }, function(error) {
          console.warn(error);
        });
      });
      break;
  }
});

module.exports = store;
