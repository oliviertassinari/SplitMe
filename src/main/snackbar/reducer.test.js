// @flow weak

import Immutable from 'immutable';
import {assert} from 'chai';
import actionTypes from 'redux/actionTypes';
import reducer from './reducer';

describe('main/snackbar/reducer.js', () => {
  const stateInit = new Immutable.Map();

  describe('settings import', () => {
    it('should display the error message if there is one', () => {
      const stateNew = reducer(stateInit, {
        type: actionTypes.SETTINGS_TAP_IMPORTED,
        payload: new Error('foo'),
        error: true,
      });

      assert.strictEqual(stateNew.get('message'), 'Error: foo');
    });
  });
});
