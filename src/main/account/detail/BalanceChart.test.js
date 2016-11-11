// @flow weak
/* eslint-env mocha */

import React from 'react';
import { assert } from 'chai';
import { shallow } from 'enzyme';
import Immutable from 'immutable';
import { AccountDetailBalanceChart } from './BalanceChart';

describe('<AccountDetailBalanceChart />', () => {
  describe('amount', () => {
    it('should format negative amount correctly', () => {
      const member = Immutable.fromJS({
        id: '0',
        balances: [{
          currency: 'EUR',
          value: -10,
        }],
      });

      const wrapper = shallow(
        <AccountDetailBalanceChart
          classes={{}}
          member={member}
          max={10}
          currency="EUR"
        />,
      );

      assert.strictEqual(
        wrapper.find('[data-test="AccountDetailBalanceChart"]').text(),
        '-€10.00');
    });

    it('should format positive amount correctly', () => {
      const member = Immutable.fromJS({
        id: '0',
        balances: [{
          currency: 'EUR',
          value: 10,
        }],
      });

      const wrapper = shallow(
        <AccountDetailBalanceChart
          classes={{}}
          member={member}
          max={10}
          currency="EUR"
        />,
      );

      assert.strictEqual(
        wrapper.find('[data-test="AccountDetailBalanceChart"]').text(),
        '€10.00');
    });
  });
});
