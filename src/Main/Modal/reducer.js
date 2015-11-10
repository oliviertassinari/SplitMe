import Immutable from 'immutable';
import actionTypes from 'redux/actionTypes';

function reducer(state, action) {
  if (state === undefined) {
    state = Immutable.fromJS({
      title: null,
      description: null,
      actions: [],
    });
  }

  switch (action.type) {
    case actionTypes.MODAL_UPDATE:
      state = state.set('title', action.title);
      state = state.set('description', action.description);
      state = state.set('actions', Immutable.fromJS(action.actions));
      return state;

    default:
      return state;
  }
}

export default reducer;
