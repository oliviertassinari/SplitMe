// @flow weak
/* eslint-env mocha */

import React from 'react';
import Immutable from 'immutable';
import { shallow } from 'enzyme';
import { assert } from 'chai';
import DatePicker from 'material-ui-build/src/DatePicker';
import { ExpenseDetail } from './Detail';

describe('<ExpenseDetail />', () => {
  describe('DatePicker', () => {
    it('should format the date correctly', () => {
      const wrapper = shallow(
        <ExpenseDetail
          account={Immutable.fromJS({})}
          accounts={Immutable.fromJS([{}])}
          dispatch={() => {}}
          expense={Immutable.fromJS({})}
          screenDialog=""
        />,
      );

      assert.strictEqual(wrapper.find(DatePicker).length, 1);
      assert.strictEqual(wrapper.instance().formatDate(new Date(2013, 9, 23)),
        'Wednesday, October 23, 2013');
    });
  });
});
