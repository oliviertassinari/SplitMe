'use strict';

var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var immutable = require('immutable');

var facebook = require('facebook');
var dispatcher = require('Main/dispatcher');

var _response = immutable.fromJS({});

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

function handleResponseError(error) {
  console.warn(error);
}

function handleResponseSuccess(response) {
  _response = immutable.fromJS(response);

  store.emitChange();

  var fields = [
    'id',
    'name',
    'email',
  ];

  facebook().then(function(facebookConnectPlugin) {
    facebookConnectPlugin.api('me/?fields=' + fields.join(','), [], function(responseMe) {
        _response = _response.set('me', immutable.fromJS(responseMe));
        store.emitChange();
      }, handleResponseError);
  });
}

/**
 * Register callback to handle all updates
 */
dispatcher.register(function(action) {
  switch(action.actionType) {
    case 'FACEBOOK_LOGIN':
      facebook().then(function(facebookConnectPlugin) {
        facebookConnectPlugin.login([
          'public_profile',
          'email',
        ], handleResponseSuccess, handleResponseError);
      });
      break;

    case 'FACEBOOK_UPDATE_LOGIN_STATUS':
      facebook().then(function(facebookConnectPlugin) {
        facebookConnectPlugin.getLoginStatus(handleResponseSuccess, handleResponseError);
      });
      break;
  }
});

module.exports = store;
