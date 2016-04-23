/* globals browser */
import {assert} from 'chai';
import Immutable from 'immutable';

import fixture from '../fixture';

let accountId;

describe('edit expense', () => {
  before((done) => {
    const account = fixture.getAccount([{
      name: 'AccountName1',
      id: '10',
    }]);

    const expenses = new Immutable.List([
      fixture.getExpense({
        paidForContactIds: ['10'],
      }),
    ]);

    browser
      .url('http://local.splitme.net:8000/accounts?locale=fr')
      .timeoutsAsyncScript(5000)
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account.toJS(), expenses.toJS()) // node.js context
      .then((response) => {
        accountId = response.value;
      })
      .call(done);
  });

  it('should show account when we navigate back form an expense we didn\'t edit', (done) => {
    browser
      .waitForExist('[data-test=ListItem]')
      .click('[data-test=ListItem]')
      .waitForExist('.testAccountDetailMore')
      .click('[data-test=ListItem]')
      .waitForExist('[data-test=ExpenseAddDescription]')
      .keys('Left arrow')
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.strictEqual(text, 'AccountName1');
      })
      .call(done);
  });

  it('should show a modal to confirm when we navigate back form an expense we edit', (done) => {
    browser
      .click('[data-test=ListItem]')
      .waitForExist('[data-test=ExpenseAddDescription]')
      .setValue('[data-test=ExpenseAddDescription]', 'descriptionEdit')
      .setValue('[data-test=ExpenseAddAmount]', 10)
      .keys('Left arrow')
      .waitForExist('[data-test=ModalButton0]')
      .pause(400)
      .click('[data-test=ModalButton0]') // Cancel
      .waitForExist('[data-test=ModalButton0]', 5000, true)
      .call(done);
  });

  it('should update balance when we edit the amount of an expense', (done) => {
    browser
      .click('[data-test=ExpenseSave]')
      .waitForExist('[data-test=ExpenseSave]', 5000, true)
      .pause(100) // Update
      .getText('[data-test=ListItemBody] span', (err, text) => {
        assert.strictEqual(text, 'descriptionEdit');
      })
      .getText('[data-test=ListItemBodyRight]', (err, text) => {
        assert.strictEqual(text, '10,00 €');
      })
      .click('[data-test=AppBar] button') // Close
      .waitForExist('.testAccountListMore') // Home
      .getText('[data-test=ListItemBodyRight] div:nth-child(2)', (err, text) => {
        assert.strictEqual(text, '5,00 €');
      })
      .call(done);
  });

  it('should update balance when we edit paidFor', (done) => {
    browser
      .click('[data-test=ListItem]')
      .waitForExist('.testAccountListMore', 5000, true) // Expense detail
      .click('[data-test=ListItem]')
      .waitForExist('[data-test=ExpenseAddPaidFor]')
      .scroll('[data-test=ExpenseAddPaidFor] [data-test=ListItem]:nth-child(1)')
      .click('[data-test=ExpenseAddPaidFor] [data-test=ListItem]:nth-child(1)')
      .click('[data-test=ExpenseSave]')
      .waitForExist('[data-test=ExpenseSave]', 5000, true)
      .click('[data-test=AppBar] button') // Close
      .waitForExist('.testAccountListMore') // Home
      .pause(400) // Update
      .getText('[data-test=ListItemBodyRight] div:nth-child(2)', (err, text) => {
        assert.strictEqual(text, '10,00 €');
      })
      .call(done);
  });

  let expenseEditUrl;

  it('should update balance when we edit currency', (done) => {
    browser
      .click('[data-test=ListItem]')
      .waitForExist('.testAccountListMore', 5000, true) // Expense detail
      .click('[data-test=ListItem]')
      .waitForExist('[data-test=ExpenseAddCurrency]')
      .click('[data-test=ExpenseAddCurrency]')
      .waitForExist('[data-test=ExpenseAddCurrencyUSD]')
      .click('[data-test=ExpenseAddCurrencyUSD]')
      .pause(800)
      .getUrl().then((url) => {
        expenseEditUrl = url;
      })
      .click('[data-test=ExpenseSave]')
      .waitForExist('[data-test=ExpenseSave]', 5000, true)
      .getText('[data-test=ListItemBodyRight]', (err, text) => {
        assert.strictEqual(text, '10,00 $US');
      })
      .click('[data-test=AppBar] button') // Close
      .waitForExist('.testAccountListMore') // Home
      .pause(400) // Update
      .getText('[data-test=ListItemBodyRight] div:nth-child(2)', (err, text) => {
        assert.strictEqual(text, '10,00 $US');
      })
      .call(done);
  });

  it('should show edit account when we navigate to the route', (done) => {
    browser
      .execute(fixture.executePushState, expenseEditUrl)
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.strictEqual(text, 'Modifier la dépense');
      })
      .refresh()
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.strictEqual(text, 'Modifier la dépense');
      })
      .execute(fixture.executePushState, 'http://local.splitme.net:8000/accounts?locale=fr')
      .call(done);
  });

  it('should update balance when we add a new member', (done) => {
    browser
      .click('[data-test=ListItem]')
      .waitForExist('.testAccountListMore', 5000, true) // Expense detail
      .click('[data-test=ListItem]')
      .waitForExist('[data-test=ExpenseAddPaidFor]')
      .scroll('[data-test=ExpenseAddPaidFor] [data-test=MemberAdd]')
      .click('[data-test=ExpenseAddPaidFor] [data-test=MemberAdd]')
      .setValue('[data-test=MemberAddName]', 'Alexandre Dupont 2')
      .keys('Enter')
      .pause(400)
      .click('[data-test=ExpenseAddPaidFor] [data-test=ListItem]:nth-child(1)') // Add me back
      .click('[data-test=ExpenseSave]')
      .waitForExist('[data-test=ExpenseSave]', 5000, true)
      .click('[data-test=AppBar] button') // Close
      .waitForExist('.testAccountListMore') // Home
      .pause(400) // Update
      .getText('[data-test=ListItemBodyRight]', (err, text) => {
        assert.strictEqual(text, 'vous doit\n6,67 $US');
      })
      .call(done);
  });

  it('should dislay a not found page when the expense do not exist', (done) => {
    browser
      .url(`http://local.splitme.net:8000/account/${accountId}/expense/11111/edit?locale=fr`)
      .waitForExist('[data-test=TextIcon]')
      .getText('[data-test=TextIcon]', (err, text) => {
        assert.strictEqual(text, 'Dépense introuvable');
      })
      .call(done);
  });
});
