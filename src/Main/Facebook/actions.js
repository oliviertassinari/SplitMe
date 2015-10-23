'use strict';

const Lie = require('lie');
const facebook = require('facebook');
const actionTypes = require('redux/actionTypes');

const actions = {
  login() {
    return function(dispatch) {
      dispatch({
        type: actionTypes.FACEBOOK_LOGIN,
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
  updateLoginStatus() {
    return function(dispatch) {
      dispatch({
        type: actionTypes.FACEBOOK_UPDATE_LOGIN_STATUS,
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
  updateMeInfo() {
    return function(dispatch, getState) {
      if (getState().getIn(['facebook', 'status']) === 'connected') {
        // Fetch user fields if connected
        dispatch({
          type: actionTypes.FACEBOOK_UPDATE_ME_INFO,
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
