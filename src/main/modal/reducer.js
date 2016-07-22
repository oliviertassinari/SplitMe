// @flow weak

import Immutable from 'immutable';
import actionTypes from 'redux/actionTypes';

function reducer(state, action) {
  const {
    type,
    payload,
  } = action;

  if (state === undefined) {
    state = Immutable.fromJS({
      title: null,
      description: null,
      actions: [],
    });
  }

  switch (type) {
    case actionTypes.MODAL_UPDATE:
      const {
        title,
        description,
        actions,
      } = payload;

      state = state.set('title', title);
      state = state.set('description', description);
      state = state.set('actions', Immutable.fromJS(actions));
      return state;

    default:
      return state;
  }
}

export default reducer;
