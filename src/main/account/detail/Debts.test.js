// @flow weak
/* eslint-env mocha */

import React from 'react';
import { assert } from 'chai';
import Immutable from 'immutable';
import createShallowWithContext from 'modules/styles/createShallowWithContext';
import Subheader from 'material-ui-build/src/Subheader';
import Transfer from 'main/account/Transfer';
import { AccountDetailDebts } from './Debts';

describe('<AccountDetailDebts />', () => {
  let shallow;

  before(() => {
    shallow = createShallowWithContext();
  });

  describe('single currency', () => {
    it('should sort transfers', () => {
      const members = Immutable.fromJS([
        {
          id: '0',
          balances: [{
            currency: 'EUR',
            value: -10,
          }],
        },
        {
          id: '1',
          balances: [{
            currency: 'EUR',
            value: 2,
          }],
        },
        {
          id: '2',
          balances: [{
            currency: 'EUR',
            value: 8,
          }],
        },
      ]);

      const wrapper = shallow(<AccountDetailDebts members={members} />);
      assert.strictEqual(wrapper.find(Subheader).length, 0,
        'no need for a Subheader with one currency');

      const transfers = wrapper.find(Transfer);
      assert.strictEqual(transfers.length, 2);
      assert.strictEqual(transfers.at(0).props().transfer.amount, 8);
      assert.strictEqual(transfers.at(1).props().transfer.amount, 2);
    });
  });

  describe('multiples currencies', () => {
    it('sort currencies', () => {
      const members = Immutable.fromJS([
        {
          id: '0',
          balances: [{
            currency: 'EUR',
            value: -10,
          }, {
            currency: 'USD',
            value: 12,
          }],
        },
        {
          id: '1',
          balances: [{
            currency: 'EUR',
            value: 10,
          }, {
            currency: 'USD',
            value: -12,
          }],
        },
      ]);

      const wrapper = shallow(<AccountDetailDebts members={members} />);
      const subheaders = wrapper.find(Subheader);
      assert.strictEqual(subheaders.length, 2);
      assert.strictEqual(subheaders.at(0).props().children, 'In USD');
      assert.strictEqual(subheaders.at(1).props().children, 'In EUR');
    });
  });

  describe('transfer close to zero', () => {
    it('should not display transfers close to zero', () => {
      const members = Immutable.fromJS([
        {
          id: '0',
          balances: [{
            currency: 'EUR',
            value: -10,
          }],
        },
        {
          id: '1',
          balances: [{
            currency: 'EUR',
            value: 0.004,
          }],
        },
        {
          id: '2',
          balances: [{
            currency: 'EUR',
            value: 9.996,
          }],
        },
      ]);

      const wrapper = shallow(<AccountDetailDebts members={members} />);
      assert.strictEqual(wrapper.find(Subheader).length, 0,
        'no need for a Subheader with one currency');

      const transfers = wrapper.find(Transfer);
      assert.strictEqual(transfers.length, 1);
      assert.strictEqual(transfers.at(0).props().transfer.amount, 9.996);
    });
  });
});
