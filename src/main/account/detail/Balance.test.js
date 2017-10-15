import React from 'react';
import { shallow } from 'enzyme';
import { assert } from 'chai';
import Immutable from 'immutable';
import { ListSubheader } from 'material-ui-next/List';
import AccountDetailBalanceChart from 'main/account/detail/BalanceChart';
import { AccountDetailBalance } from './Balance';

describe('<AccountDetailBalance />', () => {
  describe('single currency', () => {
    it('should sort members', () => {
      const members = Immutable.fromJS([
        {
          id: '0',
          balances: [
            {
              currency: 'EUR',
              value: -10,
            },
          ],
        },
        {
          id: '1',
          balances: [
            {
              currency: 'EUR',
              value: 10,
            },
          ],
        },
      ]);

      const wrapper = shallow(<AccountDetailBalance members={members} classes={{}} />);
      assert.strictEqual(
        wrapper.find(ListSubheader).length,
        0,
        'no need for a ListSubheader with one currency',
      );
      assert.strictEqual(
        wrapper
          .find(AccountDetailBalanceChart)
          .at(0)
          .props()
          .member.get('id'),
        '1',
      );
      assert.strictEqual(
        wrapper
          .find(AccountDetailBalanceChart)
          .at(1)
          .props()
          .member.get('id'),
        '0',
      );
    });
  });

  describe('multiples currencies', () => {
    it('sort currencies', () => {
      const members = Immutable.fromJS([
        {
          id: '0',
          balances: [
            {
              currency: 'EUR',
              value: -10,
            },
            {
              currency: 'USD',
              value: 12,
            },
          ],
        },
        {
          id: '1',
          balances: [
            {
              currency: 'EUR',
              value: 10,
            },
            {
              currency: 'USD',
              value: -12,
            },
          ],
        },
      ]);

      const wrapper = shallow(<AccountDetailBalance members={members} classes={{}} />);
      const subheaders = wrapper.find(ListSubheader);
      assert.strictEqual(subheaders.length, 2);
      assert.strictEqual(subheaders.at(0).props().children, 'In USD');
      assert.strictEqual(subheaders.at(1).props().children, 'In EUR');
    });
  });
});
