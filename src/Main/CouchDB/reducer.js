'use strict';

var Immutable = require('immutable');

function reducer(state, action) {
  if (state === undefined) {
    state = new Immutable.Map();
  }

  switch (action.type) {
    case '':
      return state;

    default:
      return state;
  }
}

module.exports = reducer;
