// @flow weak

import { push, goBack } from 'react-router-redux';

const actions = {
  goBack(pathname) {
    return (dispatch, getState) => {
      const state = getState();
      const action = state.get('routing').locationBeforeTransitions.action;

      if (action === 'POP') {
        dispatch(push(pathname));
      } else {
        dispatch(goBack());
      }
    };
  },
};

export default actions;
