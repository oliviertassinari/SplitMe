// @flow weak
/* eslint-env mocha */

import { assert } from 'chai';
import Immutable from 'immutable';
import fixture from '../fixture';

const account1 = fixture.getAccount({
  members: [
    {
      name: 'User1',
      id: '10',
    },
    {
      name: 'User3',
      id: '13',
    },
  ],
});

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

const account2 = fixture.getAccount({
  members: [
    {
      name: 'User2',
      id: '12',
    },
    {
      name: 'User3',
      id: '13',
    },
  ],
});

const expenses2 = new Immutable.List([
  fixture.getExpense({
    paidForContactIds: ['12'],
  }),
  fixture.getExpense({
    paidForContactIds: ['12', '13'],
    currency: 'USD',
  }),
]);

const account3 = fixture.getAccount({
  members: [
    {
      name: 'User4',
      id: '14',
    },
  ],
});

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

describe('detail account', () => {
  before(() => {
    return global.browser
      .timeouts('script', 5000);
  });

  describe('navigation', () => {
    it('should display a not found page when the acount do not exist', () => {
      return global.browser
        .urlApp('/account/1111111/expenses?locale=fr')
        .waitForExist('[data-test="TextIcon"]')
        .getText('[data-test="TextIcon"]')
        .then((text) => {
          assert.strictEqual(text, 'Compte introuvable');
        });
    });

    it('should show home when we close account', () => {
      return global.browser
        .urlApp('/accounts?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account1.toJS(),
          expenses1.toJS()) // node.js context
        .click('[data-test="ListItem"]')
        .waitForExist('.testAccountDetailMore') // Expense detail
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'User1');
        })
        .click('[data-test="AppBar"] button') // Close
        .isExisting('[data-test="ExpenseSave"]', (isExisting) => {
          assert.strictEqual(isExisting, false);
        });
    });

    it('should show home when we navigate back from an account', () => {
      return global.browser
        .urlApp('/accounts?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account1.toJS(),
          expenses1.toJS()) // node.js context
        .click('[data-test="ListItem"]')
        .waitForExist('.testAccountDetailMore') // Expense detail
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'User1');
        })
        .back()
        .waitForExist('.testAccountListMore') // Home
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Mes comptes');
        });
    });
  });

  describe('accounts sorted', () => {
    it('should show accounts well sorted when we display it', () => {
      return global.browser
        .urlApp('/accounts?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account1.toJS(),
          expenses1.toJS()) // node.js context
        .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account2.toJS(),
          expenses2.toJS()) // node.js context
        .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account3.toJS(),
          expenses3.toJS()) // node.js context
        .getText('[data-test="ListItemBody"] span')
        .then((text) => {
          assert.deepEqual(text, [
            'User2',
            'User4',
            'User1',
          ]);
        });
    });
  });

  describe('expenses sorted', () => {
    let accountDetailExpensesUrl;

    it('should show expenses well sorted when we display it', () => {
      return global.browser
        .urlApp('/accounts?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account1.toJS(),
          expenses1.toJS()) // node.js context
        .click('[data-test="ListItem"]')
        .waitForExist('.testAccountDetailMore') // Expense detail
        .getText('[data-test="ListItemBody"] span')
        .then((text) => {
          assert.deepEqual(text, [
            '2',
            '3',
            '1',
          ]);
        })
        .getUrl()
        .then((url) => {
          accountDetailExpensesUrl = url;
        });
    });

    it('should show the account expenses when we navigate to the route', () => {
      return global.browser
        .url(accountDetailExpensesUrl)
        .waitForExist('[data-test="AccountDetailTabExpenses"]')
        .getCssProperty('[data-test="AccountDetailTabExpenses"]', 'color')
        .then((color) => {
          assert.strictEqual(color.value, 'rgba(255,255,255,1)');
        });
    });
  });

  describe('balance', () => {
    let accountDetailBalanceUrl;

    it('should show the balance chart well sorted when we navigate to balance', () => {
      return global.browser
        .urlApp('/accounts?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account1.toJS(),
          expenses1.toJS()) // node.js context
        .click('[data-test="ListItem"]')
        .waitForExist('.testAccountDetailMore') // Expense detail
        .click('[data-test="AccountDetailTabBalance"]')
        .pause(400) // Wait to be interactable
        .getText('[data-test="AccountDetailBalanceChart"]')
        .then((text) => {
          assert.deepEqual(text, [
            '8,87 €',
            '-4,44 €',
            '-4,44 €',
          ]);
        })
        .getUrl()
        .then((url) => {
          accountDetailBalanceUrl = url;
        });
    });

    it('should show the account balance when we navigate to the route', () => {
      return global.browser
        .url(accountDetailBalanceUrl)
        .getCssProperty('[data-test="AccountDetailTabBalance"]', 'color')
        .then((color) => {
          assert.strictEqual(color.value, 'rgba(255,255,255,1)');
        });
    });
  });

  describe('transfer', () => {
    let accountDetailDebtsUrl;

    it('should show the good amount to be transfer when we navigate to debts', () => {
      return global.browser
        .urlApp('/accounts?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account1.toJS(),
          expenses1.toJS()) // node.js context
        .click('[data-test="ListItem"]')
        .waitForExist('.testAccountDetailMore') // Expense detail
        .click('[data-test=AccountDetailTabDebts]')
        .pause(400) // Wait to be interactable
        .isExisting('[data-test="Subheader"]')
        .then((isExisting) => {
          assert.deepEqual(isExisting, false);
        })
        .getText('[data-test="AccountDetailTransfer"] div:nth-child(2)')
        .then((text) => {
          assert.deepEqual(text, [
            '4,44 €',
            '4,44 €',
          ]);
        })
        .getUrl()
        .then((url) => {
          accountDetailDebtsUrl = url;
        });
    });

    it('should show the account debts when we navigate to the route', () => {
      return global.browser
        .url(accountDetailDebtsUrl)
        .getCssProperty('[data-test="AccountDetailTabDebts"]', 'color')
        .then((color) => {
          assert.strictEqual(color.value, 'rgba(255,255,255,1)');
        });
    });

    it('should show two amounts to be transfer when we navigate to debts', () => {
      return global.browser
        .urlApp('/accounts?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account2.toJS(),
          expenses2.toJS()) // node.js context
        .click('[data-test="ListItem"]')
        .waitForExist('.testAccountDetailMore') // Expense detail
        .click('[data-test="AccountDetailTabDebts"]')
        .pause(600) // Wait to be interactable
        .getText('[data-test="AccountDetailDebts"] [data-test="Subheader"]')
        .then((text) => {
          assert.deepEqual(text, [
            'En EUR',
            'En USD',
          ]);
        })
        .getText('[data-test="AccountDetailTransfer"] div:nth-child(2)')
        .then((text) => {
          assert.deepEqual(text, [
            '6,66 €',
            '4,44 $US',
            '4,44 $US',
          ]);
        });
    });
  });
});
