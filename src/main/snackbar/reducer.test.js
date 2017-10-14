/* eslint-env mocha */

import Immutable from 'immutable';
import { assert } from 'chai';
import actionTypes from 'redux/actionTypes';
import reducer from './reducer';

describe('main/snackbar/reducer', () => {
  const stateInit = new Immutable.Map();

  describe('error handling', () => {
    it('should ignore the error if there is not payload', () => {
      const stateNew = reducer(stateInit, {
        type: actionTypes.SETTINGS_TAP_IMPORTED,
        error: true,
      });

      assert.strictEqual(stateNew, stateInit);
    });

    it('should ignore the error if the payload is not interesting', () => {
      const stateNew = reducer(stateInit, {
        type: actionTypes.SETTINGS_TAP_IMPORTED,
        error: true,
        payload: 'Something went wrong',
      });

      assert.strictEqual(stateNew, stateInit);
    });

    it('should display the error reason if available', () => {
      const stateNew = reducer(stateInit, {
        type: actionTypes.SETTINGS_TAP_IMPORTED,
        payload: {
          reason: 'bar',
          message: 'foo',
        },
        error: true,
      });

      assert.strictEqual(stateNew.get('message'), 'Error: bar');
    });

    it('should display the error message if available', () => {
      const stateNew = reducer(stateInit, {
        type: actionTypes.SETTINGS_TAP_IMPORTED,
        payload: new Error('foo'),
        error: true,
      });

      assert.strictEqual(stateNew.get('message'), 'Error: foo');
    });
  });
});
