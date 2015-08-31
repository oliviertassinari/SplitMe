'use strict';

var assert = require('chai').assert;
var Immutable = require('immutable');

var selector = require('./selector');
var fixture = require('../fixture');

var selectorBalance = selector.appBarTab + ' div:nth-child(2)';
var selectorDebts = selector.appBarTab + ' div:nth-child(3)';

describe('detail account', function() {
  before(function(done) {
    var account1 = fixture.getAccount([
      {
        name: 'User1',
        id: '10',
      },
      {
        name: 'User3',
        id: '13',
      },
    ]);

    var expenses1 = new Immutable.List([
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

    var account2 = fixture.getAccount([
      {
        name: 'User2',
        id: '12',
      },
      {
        name: 'User3',
        id: '13',
      },
    ]);

    var expenses2 = new Immutable.List([
      fixture.getExpense({
        paidForContactIds: ['12'],
      }),
      fixture.getExpense({
        paidForContactIds: ['12', '13'],
        currency: 'USD',
      }),
    ]);

    var account3 = fixture.getAccount([
      {
        name: 'User4',
        id: '14',
      },
    ]);

    var expenses3 = new Immutable.List([
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

  it('should show expenses well sorted when we display it', function(done) {
    browser
      .waitForExist(selector.list)
      .click(selector.list + ':nth-child(1)')
      .pause(400)
      .getText(selector.list + ' div:nth-child(2) span', function(err, text) {
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
    .waitForExist(selector.settings)
    .getText(selector.appBarTitle, function(err, text) {
      assert.equal(text, 'Mes comptes');
    })
    .call(done);
  });

  it('should show two balance chart when we have two currency', function(done) {
    browser
    .click(selector.list + ':nth-child(2)')
    .waitForExist(selectorBalance)
    .click(selectorBalance)
    .getText(selector.listSubheader, function(err, text) {
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
    .getText(selector.listSubheader, function(err, text) {
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
    .getText(selector.list + ':nth-child(3) div:nth-child(3)', function(err, text) {
      assert.equal(text, 'vous doit\n6,66 $US'); // No EUR
    })
    .click(selector.list + ':nth-child(3)')
    .waitForExist(selectorBalance)
    .click(selectorBalance)
    .getText(selector.accountBalanceChart, function(err, text) {
      assert.deepEqual(text, [
        '0,00 €',
        '0,00 €',
        '6,66 $US',
        '-6,66 $US',
      ]);
    })
    .click(selectorDebts)
    .getText(selector.listSubheader, function(err, text) {
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
