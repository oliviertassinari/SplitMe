'use strict';

var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var Immutable = require('immutable');

var facebook = require('facebook');
var dispatcher = require('Main/dispatcher');

var _response = new Immutable.Map();

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

function handleResponseError(response) {
  console.warn(response.error);
}

function handleResponseSuccess(response) {
  _response = Immutable.fromJS(response);

  store.emitChange();

  // Fetch user fields
  if (response.status === 'connected') {
    var fields = [
      'id',
      'name',
      'email',
    ];

    facebook().then(function(facebookConnectPlugin) {
      facebookConnectPlugin.api('me/?fields=' + fields.join(','), [],
          function(responseMe) {
            _response = _response.set('me', Immutable.fromJS(responseMe));
            store.emitChange();
          },
          handleResponseError
        );
    });
  }
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

// _response = immutable.fromJS({
//   status: 'connected',
//   me: {
//     id: 13453386,
//     name: 'Olivier Tassinari',
//     email: 'olivier.tassinari@gmail.com',
//   },
// });

// setTimeout(function() {
//   store.emitChange();
// }, 500);

module.exports = store;
