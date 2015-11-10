import Lie from 'lie';
import pluginFacebook from 'plugin/facebook';
import actionTypes from 'redux/actionTypes';

const actions = {
  login() {
    return function(dispatch) {
      dispatch({
        type: actionTypes.FACEBOOK_LOGIN,
        payload: pluginFacebook().then((facebookConnectPlugin) => {
          return new Lie((resolve, reject) => {
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
    return function(dispatch) {
      dispatch({
        type: actionTypes.FACEBOOK_UPDATE_LOGIN_STATUS,
        payload: pluginFacebook().then((facebookConnectPlugin) => {
          return new Lie((resolve, reject) => {
            facebookConnectPlugin.getLoginStatus(resolve, reject);
          });
        }),
      }).then(() => {
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
          payload: pluginFacebook().then((facebookConnectPlugin) => {
            return new Lie((resolve, reject) => {
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

export default actions;
