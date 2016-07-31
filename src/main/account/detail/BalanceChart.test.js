// @flow weak

import React from 'react';
import {assert} from 'chai';
import Immutable from 'immutable';
import createShallowWithContext from 'modules/styles/createShallowWithContext';
import {AccountDetailBalanceChart} from './BalanceChart';

describe('<AccountDetailBalanceChart />', () => {
  let shallow;

  before(() => {
    shallow = createShallowWithContext();
  });

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
          member={member}
          max={10}
          currency="EUR"
        />
      );

      assert.strictEqual(wrapper.find('span').text(), '-10,00 €');
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
          member={member}
          max={10}
          currency="EUR"
        />
      );

      assert.strictEqual(wrapper.find('span').text(), '10,00 €');
    });
  });
});
