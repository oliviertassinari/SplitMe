// @flow weak
/* eslint-env mocha */

import { assert } from 'chai';
import Immutable from 'immutable';
import fixture from '../fixture';

const account = fixture.getAccount({
  members: [
    {
      name: 'Bob Leponge',
      id: '14',
    },
  ],
});

const expenses = new Immutable.List([
  fixture.getExpense({
    paidForContactIds: ['14'],
  }),
]);

function browserAddExpense(browser, options = {}) {
  browser = browser
    .waitForExist('[data-test="ExpenseAddDescription"]')
    .setValue('[data-test="ExpenseAddDescription"]', options.description)
    .setValue('[data-test="ExpenseAddAmount"]', options.amount)
  ;

  if (typeof options.accountToUse === 'number') {
    browser = browser
      .click('[data-test="ExpenseAddRelatedAccount"]')
      .waitForExist('.testExpenseAddRelatedAccountDialog')
      .pause(400)
      .click(`.testExpenseAddRelatedAccountDialog [data-test="ListItem"]:nth-child(${options.accountToUse})`)
      .waitForExist('.testExpenseAddRelatedAccountDialog', 5000, true)
    ;
  }

  browser = browser
    .click('[data-test="ExpenseAddPaidBy"]')
    .waitForExist('.testExpenseAddPaidByDialog')
    .pause(400)
  ;

  if (typeof options.memberToUse === 'number') {
    browser = browser
      .click(`.testExpenseAddPaidByDialog [data-test="ListItem"]:nth-child(${options.memberToUse})`)
    ;
  } else {
    browser = browser
      .click('.testExpenseAddPaidByDialog [data-test="MemberAdd"]')
      .setValue('[data-test="MemberAddName"]', options.memberToUse)
      .keys('Enter')
    ;
  }

  browser = browser
    .waitForExist('.testExpenseAddPaidByDialog', 5000, true)
    .click('[data-test="ExpenseSave"]')
    .pause(300)
  ;

  return browser;
}

describe('add expense', () => {
  before(() => {
    return global.browser.timeouts('script', 5000);
  });

  describe('navigation from home', () => {
    it('should dislay a not found page when the account do not exist', () => {
      return global.browser
        .urlApp('/account/1111111111/expense/add?locale=fr')
        .waitForExist('[data-test="TextIcon"]')
        .getText('[data-test="TextIcon"]')
        .then((text) => {
          assert.strictEqual(text, 'Compte introuvable');
        });
    });

    it('should show the add expense page when we navigate to the route', () => {
      return global.browser
        .urlApp('/expense/add?locale=fr')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Nouvelle dépense');
        });
    });

    it('should show new expense when we tap on main-button', () => {
      return global.browser
        .urlApp('/accounts?locale=fr')
        .click('[data-test="MainActionButton"]')
        .waitForExist('[data-test="ExpenseSave"]')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Nouvelle dépense');
        });
    });

    it('should show a modal when we add an invalid expense', () => {
      return global.browser
        .urlApp('/expense/add?locale=fr')
        .waitForExist('[data-test="ExpenseSave"]')
        .click('[data-test="ExpenseSave"]')
        .waitForDialog()
        .waitForExist('[data-test="ModalButton0"]')
        .click('[data-test="ModalButton0"]') // Cancel
        .waitForExist('[data-test="ModalButton0"]', 5000, true);
    });

    it('should show home when we close new expense', () => {
      return global.browser
        .urlApp('/expense/add?locale=fr')
        .click('[data-test="AppBar"] button') // Close
        .waitForExist('.testAccountListMore')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Mes comptes');
        });
    });

    it('should show a modal to confirm when we navigate back form new expense', () => {
      return global.browser
        .urlApp('/accounts?locale=fr')
        .click('[data-test="MainActionButton"]')
        .waitForExist('[data-test="ExpenseSave"]')
        .setValue('[data-test=ExpenseAddDescription]', 'Edited')
        .back()
        .waitForDialog()
        .waitForExist('[data-test="ModalButton1"]')
        .click('[data-test="ModalButton1"]') // Delete
        .waitForExist('.testAccountListMore')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Mes comptes');
        });
    });
  });

  describe('add from home', () => {
    it('should show home when we add a new expense', () => {
      return global.browser
        .urlApp('/expense/add?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .then(() => {
          return browserAddExpense(global.browser, {
            description: 'Expense 1',
            amount: 13.13,
            accountToUse: 'current',
            memberToUse: 'Alexandre Dupont',
          });
        })
        .isExisting('[data-test="ExpenseSave"]', (isExisting) => {
          assert.strictEqual(isExisting, false);
        })
        .waitForExist('[data-test="ListItemBodyRight"]')
        .getText('[data-test="ListItemBodyRight"] div:nth-child(2)')
        .then((text) => {
          assert.strictEqual(text, '6,57 €');
        });
    });

    it('should show home when we add a 2nd expense on the same account', () => {
      return global.browser
        .urlApp('/expense/add?locale=fr')
        .then(() => {
          return browserAddExpense(global.browser, {
            description: 'Expense 2',
            amount: 10,
            accountToUse: 1,
            memberToUse: 2,
          });
        })
        .isExisting('[data-test="ExpenseSave"]', (isExisting) => {
          assert.strictEqual(isExisting, false);
        })
        .waitForExist('[data-test="ListItemBodyRight"] div:nth-child(2)')
        .getText('[data-test="ListItemBodyRight"] div:nth-child(2)')
        .then((text) => {
          assert.strictEqual(text, '11,57 €');
        });
    });

    it('should show account when we tap on it', () => {
      return global.browser
        .click('[data-test="ListItem"]')
        .waitForExist('.testAccountListMore', 5000, true) // Expense detail
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Alexandre Dupont');
        })
        .waitForExist('[data-test="ListItemBody"] span')
        .getText('[data-test="ListItemBody"] span')
        .then((text) => {
          assert.deepEqual(text, [
            'Expense 2',
            'Expense 1',
          ]);
        });
    });

    it('should show new account in the list when we add a new expense', () => {
      return global.browser
        .urlApp('/expense/add?locale=fr')
        .then(() => {
          return browserAddExpense(global.browser, {
            description: 'Expense 4',
            amount: 13.13,
            accountToUse: 'current',
            memberToUse: 'Alexandre Dupont',
          });
        })
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Mes comptes');
        })
        .waitForExist('[data-test="ListItem"]:nth-child(2)')
        .getText('[data-test="ListItemBodyRight"] div:nth-child(2)')
        .then((text) => {
          assert.deepEqual(text, [
            '6,57 €',
            '11,57 €',
          ]);
        });
    });
  });

  describe('navigation from account', () => {
    before(() => {
      return global.browser
        .urlApp('/accounts?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account.toJS(),
          expenses.toJS()); // node.js context
    });

    it('should show account when we navigate back from edit expense', () => {
      return global.browser
        .waitForExist('[data-test="ListItem"]')
        .click('[data-test="ListItem"]')
        .waitForExist('.testAccountDetailMore') // Expense detail
        .click('[data-test="ListItem"]')
        .waitForExist('[data-test="ExpenseSave"]') // Expense edit
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Modifier la dépense');
        })
        .click('[data-test="AppBar"] button') // Close
        .waitForExist('.testAccountDetailMore')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Bob Leponge');
        });
    });

    it('should prefilled paidFor expense when we tap on add new expense', () => {
      return global.browser
        .click('[data-test="MainActionButton"]')
        .waitForExist('[data-test="ExpenseAddPaidFor"]') // Expense add
        .elements('[data-test="ExpenseAddPaidFor"] [data-test="ListItem"]', (err, res) => {
          assert.strictEqual(res.value.length, 2);
        });
    });

    it('should hide the modal when we navigate back', () => {
      return global.browser
        .click('[data-test="ExpenseSave"]')
        .waitForExist('[data-test="ModalButton0"]')
        .back()
        .waitForExist('[data-test="ModalButton0"]', 5000, true)
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Nouvelle dépense');
        });
    });

    it('should show account when we close new expense', () => {
      return global.browser
        .click('[data-test="AppBar"] button') // Close
        .waitForExist('.testAccountDetailMore')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Bob Leponge');
        });
    });
  });

  describe('add from account', () => {
    it('should work when we add an expense inside an account', () => {
      return global.browser
        .urlApp('/accounts?locale=fr')
        .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
        .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account.toJS(),
          expenses.toJS()) // node.js context
        .click('[data-test="ListItem"]')
        .waitForExist('.testAccountDetailMore') // Expense detail
        .click('[data-test="MainActionButton"]')
        .refresh()
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Nouvelle dépense');
        })
        .then(() => {
          return browserAddExpense(global.browser, {
            description: 'Expense 3',
            amount: 3.13,
            accountToUse: 'current',
            memberToUse: 'Alexandre Dupont 2',
          });
        })
        .waitForExist('[data-test="ExpenseListItem"]:nth-child(2)')
        .getText('[data-test="ListItemBodyRight"]')
        .then((text) => {
          assert.deepEqual(text, [
            '3,13 €',
            '13,31 €',
          ]);
        });
    });
  });
});
