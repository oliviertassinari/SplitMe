// @flow weak

import {assert} from 'chai';
import Immutable from 'immutable';
import fixture from '../fixture';
import API from '../../src/API';

const account = fixture.getAccount({
  members: [{
    name: 'AccountName1',
    id: '10',
  }],
});

const expenses = new Immutable.List([
  fixture.getExpense({
    paidForContactIds: ['10'],
  }),
]);

describe('edit expense', () => {
  before(() => {
    return global.browser
      .timeouts('script', 5000);
  });

  let accountStored;
  let accountStoredId;

  beforeEach(() => {
    return global.browser
      .url('http://local.splitme.net:8000/accounts?locale=fr')
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account.toJS(), expenses.toJS()) // node.js context
      .then((response) => {
        accountStored = response.value.account;
        accountStoredId = API.accountRemovePrefixId(accountStored._id);
      });
  });

  describe('navigation', () => {
    it('should display a not found page when the expense do not exist', () => {
      global.browser
        .then(() => {
          return global.browser.url(`http://local.splitme.net:8000/account/${
            accountStoredId
          }/expense/11111/edit?locale=fr`);
        })
        .waitForExist('[data-test="TextIcon"]')
        .getText('[data-test="TextIcon"]')
        .then((text) => {
          assert.strictEqual(text, 'Dépense introuvable');
        });
    });

    it('should show edit expense when we navigate to the route', () => {
      global.browser
        .then(() => {
          return global.browser.url(`http://local.splitme.net:8000/account/${
            accountStoredId
          }/expense/${
            API.expenseRemovePrefixId(accountStored.expenses[0]._id)
          }/edit?locale=fr`);
        })
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Modifier la dépense');
        });
    });

    it('should show account when we navigate back form an expense we didn\'t edit', () => {
      global.browser
        .then(() => {
          return global.browser.url(`http://local.splitme.net:8000/account/${
            accountStoredId
          }/expenses?locale=fr`);
        })
        .waitForExist('[data-test="ListItem"]')
        .click('[data-test="ListItem"]')
        .waitForExist('[data-test="ExpenseAddDescription"]')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'Modifier la dépense');
        })
        .back()
        .waitForExist('.testAccountDetailMore')
        .getText('[data-test="AppBar"] h1')
        .then((text) => {
          assert.strictEqual(text, 'AccountName1');
        });
    });

    it('should show a modal to confirm when we navigate back form an expense we edit', () => {
      global.browser
        .then(() => {
          return global.browser.url(`http://local.splitme.net:8000/account/${
            accountStoredId
          }/expenses?locale=fr`);
        })
        .waitForExist('[data-test="ListItem"]')
        .click('[data-test="ListItem"]')
        .waitForExist('[data-test="ExpenseAddDescription"]')
        .setValue('[data-test="ExpenseAddDescription"]', 'Edited')
        .back()
        .waitForExist('[data-test="ModalButton0"]')
        .pause(400)
        .click('[data-test="ModalButton0"]') // Cancel
        .waitForExist('[data-test="ModalButton0"]', 5000, true);
    });
  });

  describe('edit amount', () => {
    it('should update balance when we edit the amount of an expense', () => {
      global.browser
        .then(() => {
          return global.browser.url(`http://local.splitme.net:8000/account/${
            accountStoredId
          }/expenses?locale=fr`);
        })
        .waitForExist('[data-test="ListItem"]')
        .click('[data-test="ListItem"]')
        .waitForExist('[data-test="ExpenseAddDescription"]')
        .setValue('[data-test="ExpenseAddDescription"]', 'descriptionEdit')
        .setValue('[data-test="ExpenseAddAmount"]', 10)
        .click('[data-test="ExpenseSave"]')
        .waitForExist('[data-test="ExpenseSave"]', 5000, true)
        .pause(100) // Update
        .getText('[data-test="ListItemBody"] span')
        .then((text) => {
          assert.strictEqual(text, 'descriptionEdit');
        })
        .getText('[data-test="ListItemBodyRight"]')
        .then((text) => {
          assert.strictEqual(text, '10,00 €');
        })
        .click('[data-test="AppBar"] button') // Close
        .waitForExist('.testAccountListMore') // Home
        .getText('[data-test="ListItemBodyRight"] div:nth-child(2)')
        .then((text) => {
          assert.strictEqual(text, '5,00 €');
        });
    });
  });

  describe('edit paidFor', () => {
    it('should update balance when we edit paidFor', () => {
      global.browser
        .then(() => {
          return global.browser.url(`http://local.splitme.net:8000/account/${
            accountStoredId
          }/expenses?locale=fr`);
        })
        .waitForExist('[data-test="ListItem"]')
        .click('[data-test="ListItem"]')
        .waitForExist('[data-test="ExpenseAddPaidFor"]')
        .scroll('[data-test="ExpenseAddPaidFor"] [data-test="ListItem"]:nth-child(1)')
        .click('[data-test="ExpenseAddPaidFor"] [data-test="ListItem"]:nth-child(1)')
        .click('[data-test="ExpenseSave"]')
        .waitForExist('[data-test="ExpenseSave"]', 5000, true)
        .click('[data-test="AppBar"] button') // Close
        .waitForExist('.testAccountListMore') // Home
        .pause(400) // Update
        .getText('[data-test="ListItemBodyRight"] div:nth-child(2)')
        .then((text) => {
          assert.strictEqual(text, '13,31 €');
        });
    });
  });

  describe('edit currency', () => {
    it('should update balance when we edit currency', () => {
      global.browser
        .then(() => {
          return global.browser.url(`http://local.splitme.net:8000/account/${
            accountStoredId
          }/expenses?locale=fr`);
        })
        .waitForExist('[data-test="ListItem"]')
        .click('[data-test="ListItem"]')
        .waitForExist('[data-test="ExpenseAddCurrency"]')
        .click('[data-test="ExpenseAddCurrency"]')
        .waitForExist('[data-test="ExpenseAddCurrencyUSD"]')
        .click('[data-test="ExpenseAddCurrencyUSD"]')
        .pause(800)
        .click('[data-test="ExpenseSave"]')
        .waitForExist('[data-test="ExpenseSave"]', 5000, true)
        .getText('[data-test="ListItemBodyRight"]')
        .then((text) => {
          assert.strictEqual(text, '13,31 $US');
        })
        .click('[data-test="AppBar"] button') // Close
        .waitForExist('.testAccountListMore') // Home
        .pause(400) // Update
        .getText('[data-test="ListItemBodyRight"] div:nth-child(2)')
        .then((text) => {
          assert.strictEqual(text, '6,66 $US');
        });
    });
  });

  describe('add new member', () => {
    it('should update balance when we add a new member', () => {
      return global.browser
        .then(() => {
          return global.browser.url(`http://local.splitme.net:8000/account/${
            accountStoredId
          }/expenses?locale=fr`);
        })
        .waitForExist('[data-test="ListItem"]')
        .click('[data-test="ListItem"]')
        .waitForExist('[data-test="ExpenseAddPaidFor"]')
        .scroll('[data-test="ExpenseAddPaidFor"] [data-test="MemberAdd"]')
        .click('[data-test="ExpenseAddPaidFor"] [data-test="MemberAdd"]')
        .setValue('[data-test="MemberAddName"]', 'Alexandre Dupont 2')
        .keys('Enter')
        .pause(400) // Wait for the AutoComplete
        .click('[data-test="ExpenseAddPaidFor"] [data-test="ListItem"]:nth-child(1)') // Add me back
        .click('[data-test="ExpenseSave"]')
        .waitForExist('[data-test="ExpenseSave"]', 5000, true)
        .click('[data-test="AppBar"] button') // Close
        .waitForExist('.testAccountListMore') // Home
        .pause(400) // Update
        .getText('[data-test="ListItemBodyRight"]')
        .then((text) => {
          assert.strictEqual(text, 'vous doit\n13,31 €');
        });
    });
  });
});
