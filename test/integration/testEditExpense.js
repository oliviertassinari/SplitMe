import {assert} from 'chai';
import Immutable from 'immutable';

import fixture from '../fixture';

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
      .url('http://local.splitme.net:8000/?locale=fr#/accounts')
      .timeoutsAsyncScript(5000)
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account.toJS(), expenses.toJS()) // node.js context
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
        assert.equal(text, 'AccountName1');
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
      .waitForExist('[data-test=ModalButton0]', 1000, true)
      .call(done);
  });

  it('should update balance when we edit the amount of an expense', (done) => {
    browser
      .click('[data-test=ExpenseSave]')
      .waitForExist('[data-test=ExpenseSave]', 1000, true)
      .pause(100) // Update
      .getText('[data-test=ListItemBody] span', (err, text) => {
        assert.equal(text, 'descriptionEdit');
      })
      .getText('[data-test=ListItemBodyRight]', (err, text) => {
        assert.equal(text, '10,00 €');
      })
      .click('[data-test=AppBar] button') // Close
      .waitForExist('.testAccountListMore') // Home
      .getText('[data-test=ListItemBodyRight] div:nth-child(2)', (err, text) => {
        assert.equal(text, '5,00 €');
      })
      .call(done);
  });

  it('should update balance when we edit paidFor', (done) => {
    browser
      .click('[data-test=ListItem]')
      .waitForExist('.testAccountListMore', 1000, true) // Expense detail
      .click('[data-test=ListItem]')
      .waitForExist('[data-test=ExpenseAddPaidFor]')
      .scroll('[data-test=ExpenseAddPaidFor] [data-test=ListItem]:nth-child(2)')
      .click('[data-test=ExpenseAddPaidFor] [data-test=ListItem]:nth-child(2)')
      .click('[data-test=ExpenseSave]')
      .waitForExist('[data-test=ExpenseSave]', 1000, true)
      .click('[data-test=AppBar] button') // Close
      .waitForExist('.testAccountListMore') // Home
      .pause(400) // Update
      .getText('[data-test=ListItemBodyRight] div:nth-child(2)', (err, text) => {
        assert.equal(text, '10,00 €');
      })
      .call(done);
  });

  let expenseEditUrl;

  it('should update balance when we edit currency', (done) => {
    browser
      .click('[data-test=ListItem]')
      .waitForExist('.testAccountListMore', 1000, true) // Expense detail
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
      .waitForExist('[data-test=ExpenseSave]', 1000, true)
      .getText('[data-test=ListItemBodyRight]', (err, text) => {
        assert.equal(text, '10,00 $US');
      })
      .click('[data-test=AppBar] button') // Close
      .waitForExist('.testAccountListMore') // Home
      .pause(400) // Update
      .getText('[data-test=ListItemBodyRight] div:nth-child(2)', (err, text) => {
        assert.equal(text, '10,00 $US');
      })
      .call(done);
  });

  it('should show edit account when we navigate to the route', (done) => {
    browser
      .url(expenseEditUrl)
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Modifier la dépense');
      })
      .refresh()
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Modifier la dépense');
      })
      .url('http://local.splitme.net:8000/?locale=fr#/accounts')
      .call(done);
  });

  it('should update balance when we add a new member', (done) => {
    browser
      .click('[data-test=ListItem]')
      .waitForExist('.testAccountListMore', 1000, true) // Expense detail
      .click('[data-test=ListItem]')
      .waitForExist('[data-test=ExpenseAddPaidFor]')
      .scroll('[data-test=ExpenseAddPaidFor] div:nth-child(4) [data-test=ListItem]')
      .click('[data-test=ExpenseAddPaidFor] div:nth-child(4) [data-test=ListItem]')
      .click('[data-test=ExpenseAddPaidFor] [data-test=ListItem]:nth-child(2)') // Add me back
      .click('[data-test=ExpenseSave]')
      .waitForExist('[data-test=ExpenseSave]', 1000, true)
      .click('[data-test=AppBar] button') // Close
      .waitForExist('.testAccountListMore') // Home
      .pause(400) // Update
      .getText('[data-test=ListItemBodyRight] div:nth-child(2)', (err, text) => {
        assert.equal(text, '6,67 $US');
      })
      .call(done);
  });
});
