// @flow weak

import pluginFacebook from 'plugin/facebook';
import {fetchJson} from 'fetch';
import actionTypes from 'redux/actionTypes';

const actions = {
  login() {
    return (dispatch) => {
      dispatch({
        type: actionTypes.FACEBOOK_LOGIN,
        payload: pluginFacebook().then((facebookConnectPlugin) => {
          return new Promise((resolve, reject) => {
            facebookConnectPlugin.login([
              'public_profile',
              'email',
            ], resolve, reject);
          });
        }),
      }).then(() => {
        dispatch(actions.updateMeInfo());
      });
    };
  },
  updateLoginStatus() {
    return (dispatch, getState) => {
      dispatch({
        type: actionTypes.FACEBOOK_UPDATE_LOGIN_STATUS,
        payload: pluginFacebook().then((facebookConnectPlugin) => {
          return new Promise((resolve, reject) => {
            facebookConnectPlugin.getLoginStatus(resolve, reject);
          });
        }),
      }).then(() => {
        dispatch(actions.updateMeInfo());

        fetchJson('/api/login', {
          method: 'post',
          body: {
            accessToken: getState().getIn(['facebook', 'authResponse', 'accessToken']),
          },
        })
          .then((response) => {
            console.log(response); // eslint-disable-line no-console
          });
      });
    };
  },
  updateMeInfo() {
    return (dispatch, getState) => {
      if (getState().getIn(['facebook', 'status']) === 'connected') {
        // Fetch user fields if connected
        dispatch({
          type: actionTypes.FACEBOOK_UPDATE_ME_INFO,
          payload: pluginFacebook().then((facebookConnectPlugin) => {
            return new Promise((resolve, reject) => {
              const fields = [
                'id',
                'name',
                'email',
              ];
              facebookConnectPlugin.api(`me/?fields=${fields.join(',')}`, [],
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

export default actions;
