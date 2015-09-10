'use strict';

const Lie = require('lie');
const facebook = require('facebook');

const actions = {
  login: function() {
    return function(dispatch) {
      dispatch({
        type: 'FACEBOOK_LOGIN',
        payload: facebook().then(function(facebookConnectPlugin) {
          return new Lie(function(resolve, reject) {
            facebookConnectPlugin.login([
              'public_profile',
              'email',
            ], resolve, reject);
          });
        }),
      }).then(function() {
        dispatch(actions.updateMeInfo());
      });
    };
  },
  updateLoginStatus: function() {
    return function(dispatch) {
      dispatch({
        type: 'FACEBOOK_UPDATE_LOGIN_STATUS',
        payload: facebook().then(function(facebookConnectPlugin) {
          return new Lie(function(resolve, reject) {
            facebookConnectPlugin.getLoginStatus(resolve, reject);
          });
        }),
      }).then(function() {
        dispatch(actions.updateMeInfo());
      });
    };
  },
  updateMeInfo: function() {
    return function(dispatch, getState) {
      if (getState().getIn(['facebook', 'status']) === 'connected') {
        // Fetch user fields if connected
        dispatch({
          type: 'FACEBOOK_UPDATE_ME_INFO',
          payload: facebook().then(function(facebookConnectPlugin) {
            return new Lie(function(resolve, reject) {
              const fields = [
                'id',
                'name',
                'email',
              ];
              facebookConnectPlugin.api('me/?fields=' + fields.join(','), [],
                resolve,
                reject
              );
            });
          }),
        });
      }
    };
  },
};

module.exports = actions;
