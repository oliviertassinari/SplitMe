/* eslint-env mocha */

import React from 'react';
import Immutable from 'immutable';
import { shallow } from 'enzyme';
import { assert } from 'chai';
import TextIconError from 'modules/components/TextIconError';
import { AccountList } from './List';

describe('<AccountList />', () => {
  describe('error', () => {
    it('should render an error message', () => {
      const wrapper = shallow(
        <AccountList
          accounts={Immutable.fromJS({
            payload: [],
            status: 'error',
          })}
          dispatch={() => {}}
        />,
      );

      assert.strictEqual(wrapper.find(TextIconError).length, 1);
    });
  });
});
