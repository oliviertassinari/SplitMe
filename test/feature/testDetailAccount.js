'use strict';

const assert = require('chai').assert;
const Immutable = require('immutable');

const selector = require('./selector');
const fixture = require('../fixture');

const selectorBalance = selector.appBarTab + ' div:nth-child(2)';
const selectorDebts = selector.appBarTab + ' div:nth-child(3)';

describe('detail account', function() {
  before(function(done) {
    const account1 = fixture.getAccount([
      {
        name: 'User1',
        id: '10',
      },
      {
        name: 'User3',
        id: '13',
      },
    ]);

    const expenses1 = new Immutable.List([
      fixture.getExpense({
        description: '1',
        paidForContactIds: ['10'],
        date: '2015-03-11',
      }),
      fixture.getExpense({
        description: '2',
        paidByContactId: '10',
        paidForContactIds: ['10', '13'],
        date: '2015-03-13',
      }),
      fixture.getExpense({
        description: '3',
        paidForContactIds: ['10'],
        date: '2015-03-12',
      }),
    ]);

    const account2 = fixture.getAccount([
      {
        name: 'User2',
        id: '12',
      },
      {
        name: 'User3',
        id: '13',
      },
    ]);

    const expenses2 = new Immutable.List([
      fixture.getExpense({
        paidForContactIds: ['12'],
      }),
      fixture.getExpense({
        paidForContactIds: ['12', '13'],
        currency: 'USD',
      }),
    ]);

    const account3 = fixture.getAccount([
      {
        name: 'User4',
        id: '14',
      },
    ]);

    const expenses3 = new Immutable.List([
      fixture.getExpense({
        paidForContactIds: ['14'],
      }),
      fixture.getExpense({
        amount: 13.30,
        paidByContactId: '14',
        paidForContactIds: ['14'],
      }),
      fixture.getExpense({
        paidForContactIds: ['14'],
        currency: 'USD',
      }),
    ]);

    browser
      .url('http://0.0.0.0:8000')
      .timeoutsAsyncScript(5000)
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account1.toJS(), expenses1.toJS()) // node.js context
      .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account2.toJS(), expenses2.toJS()) // node.js context
      .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account3.toJS(), expenses3.toJS()) // node.js context
      .call(done);
  });

  it('should show accounts well sorted when we display it', function(done) {
    browser
      .waitForExist(selector.listItem)
      .getText(selector.listItemBody + ' span', function(err, text) {
        assert.deepEqual(text, [
          'User2',
          'User4',
          'User1',
        ]);
      })
      .call(done);
  });

  it('should show expenses well sorted when we display it', function(done) {
    browser
      .click('div:nth-child(3) > ' + selector.listItem)
      .waitForExist(selector.settings, 1000, true) // Expense detail
      .getText(selector.listItemBody + ' span', function(err, text) {
        assert.deepEqual(text, [
          '2',
          '3',
          '1',
        ]);
      })
      .call(done);
  });

  it('should show the balance chart well sorted when we navigate to balance', function(done) {
    browser
      .click(selectorBalance)
      .pause(400) // Wait annimation end
      .getText(selector.accountBalanceChart, function(err, text) {
        assert.deepEqual(text, [
          '8,87 €',
          '-4,44 €',
          '-4,44 €',
        ]);
      })
      .call(done);
  });

  it('should show the good amount to be transfer when we navigate to debts', function(done) {
    browser
    .click(selectorDebts)
    .getText(selector.listSubheader, function(err, text) {
      assert.deepEqual(text, undefined);
    })
    .getText(selector.accountTransferValue, function(err, text) {
      assert.deepEqual(text, [
        '4,44 €',
        '4,44 €',
      ]);
    })
    .call(done);
  });

  it('should show home when we navigate back', function(done) {
    browser
    .keys('Left arrow')
    .waitForExist(selector.settings) // Home
    .getText(selector.appBarTitle, function(err, text) {
      assert.equal(text, 'Mes comptes');
    })
    .call(done);
  });

  it('should show two balance chart when we have two currency', function(done) {
    browser
    .click('div:nth-child(1) > ' + selector.listItem)
    .waitForExist(selectorBalance)
    .click(selectorBalance)
    .getText(selector.accountBalance + ' ' + selector.listSubheader, function(err, text) {
      assert.deepEqual(text, [
        'En €',
        'En $US',
      ]);
    })
    .getText(selector.accountBalanceChart, function(err, text) {
      assert.deepEqual(text, [
        '6,66 €',
        '-6,66 €',
        '8,87 $US',
        '-4,44 $US',
        '-4,44 $US',
      ]);
    })
    .call(done);
  });

  it('should show two amounts to be transfer when we navigate to debts', function(done) {
    browser
      .click(selectorDebts)
      .getText(selector.accountDebts + ' ' + selector.listSubheader, function(err, text) {
        assert.deepEqual(text, [
          'En €',
          'En $US',
        ]);
      })
      .getText(selector.accountTransferValue, function(err, text) {
        assert.deepEqual(text, [
          '6,66 €',
          '4,44 $US',
          '4,44 $US',
        ]);
      })
      .call(done);
  });

  it('should show correctly balance value when the balance is close to zero', function(done) {
    browser
      .keys('Left arrow')
      .waitForExist(selector.settings) // Home
      .getText('div:nth-child(2) > ' + selector.listItem + ' ' + selector.listItemBodyRight, function(err, text) {
        assert.equal(text, 'vous doit\n6,66 $US'); // No EUR
      })
      .click('div:nth-child(2) > ' + selector.listItem)
      .waitForExist(selectorBalance)
      .click(selectorBalance)
      .pause(400) // Wait annimation end
      .getText(selector.accountBalanceChart, function(err, text) {
        assert.deepEqual(text, [
          '0,00 €',
          '0,00 €',
          '6,66 $US',
          '-6,66 $US',
        ]);
      })
      .click(selectorDebts)
      .getText(selector.accountDebts + ' ' + selector.listSubheader, function(err, text) {
        assert.deepEqual(text, undefined);
      })
      .getText(selector.accountTransferValue, function(err, text) {
        assert.equal(text, [
          '6,66 $US',
        ]);
      })
      .call(done);
  });


});
