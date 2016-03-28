import Immutable from 'immutable';

function reducer(state, action) {
  const {
    type,
  } = action;

  if (state === undefined) {
    state = Immutable.fromJS({
    });
  }

  switch (type) {
    default:
      return state;
  }
}

export default reducer;
