import {assert} from 'chai';

import fixture from '../fixture';

describe('add expense', () => {
  before((done) => {
    browser
      .url('http://local.splitme.net:8000/accounts?locale=fr')
      .timeoutsAsyncScript(5000)
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .call(done);
  });

  it('should show new expense when we tap on main-button', (done) => {
    browser
      .click('[data-test=MainActionButton]')
      .waitForExist('[data-test=ExpenseSave]')
      .call(done);
  });

  it('should show a modal when we add an invalid expense', (done) => {
    browser
      .click('[data-test=ExpenseSave]')
      .waitForExist('[data-test=ModalButton0]')
      .pause(400)
      .click('[data-test=ModalButton0]') // Cancel
      .waitForExist('[data-test=ModalButton0]', 1000, true)
      .call(done);
  });

  it('should show home when we close new expense', (done) => {
    browser
      .click('[data-test=AppBar] button') // Close
      .waitForExist('[data-test=ExpenseSave]', 1000, true)
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Mes comptes');
      })
      .call(done);
  });

  it('should show the add expense page when we navigate to the route', (done) => {
    browser
      .execute(fixture.executePushState, 'http://local.splitme.net:8000/expense/add?locale=fr')
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Nouvelle dépense');
      })
      .refresh()
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Nouvelle dépense');
      })
      .call(done);
  });

  it('should show a modal to confirm when we navigate back form new expense', (done) => {
    browser
      .execute(fixture.executePushState, 'http://local.splitme.net:8000/expense/add?locale=fr')
      .waitForExist('[data-test=ExpenseSave]')
      .keys('Left arrow')
      .waitForExist('[data-test=ModalButton1]')
      .pause(400)
      .click('[data-test=ModalButton1]') // Delete
      .waitForExist('[data-test=ExpenseSave]', 1000, true)
      .pause(400) // Modal disappear
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Mes comptes');
      })
      .call(done);
  });

  function browserAddExpense(browser, description, amount, accountToUse) {
    browser = browser
      .waitForExist('[data-test=ExpenseAddDescription]')
      .setValue('[data-test=ExpenseAddDescription]', description)
      .setValue('[data-test=ExpenseAddAmount]', amount)
    ;

    if (typeof accountToUse === 'number') {
      browser = browser
        .click('[data-test=ExpenseAddRelatedAccount]')
        .waitForExist('.testExpenseAddRelatedAccountDialog')
        .pause(400)
        .click(`.testExpenseAddRelatedAccountDialog [data-test=ListItem]:nth-child(${accountToUse})`)
        .waitForExist('.testExpenseAddRelatedAccountDialog', 1000, true)
      ;
    }

    browser = browser
      .click('[data-test=ExpenseAddPaidBy]')
      .waitForExist('.testExpenseAddPaidByDialog')
      .pause(400)
    ;

    if (typeof accountToUse === 'number') {
      browser = browser
        .click('.testExpenseAddPaidByDialog [data-test=ListItem]:nth-child(2)')
      ;
    } else {
      browser = browser
        .click('.testExpenseAddPaidByDialog [data-test=MemberAdd]')
      ;
    }

    browser = browser
      .waitForExist('.testExpenseAddPaidByDialog', 2000, true)
      .click('[data-test=ExpenseSave]')
      .pause(300)
    ;

    return browser;
  }

  it('should show home when we add a new expense', (done) => {
    browser
      .execute(fixture.executePushState, 'http://local.splitme.net:8000/expense/add?locale=fr')
      .then(() => {
        return browserAddExpense(browser, 'Expense 1', 13.13);
      })
      .isExisting('[data-test=ExpenseSave]', (err, isExisting) => {
        assert.isFalse(isExisting);
      })
      .waitForExist('[data-test=ListItemBodyRight]')
      .getText('[data-test=ListItemBodyRight] div:nth-child(2)', (err, text) => {
        assert.equal(text, '6,57 €');
      })
      .call(done);
  });

  it('should show home when we add a 2nd expense on the same account', (done) => {
    browser
      .execute(fixture.executePushState, 'http://local.splitme.net:8000/expense/add?locale=fr')
      .then(() => {
        return browserAddExpense(browser, 'Expense 2', 13.13, 1);
      })
      .isExisting('[data-test=ExpenseSave]', (err, isExisting) => {
        assert.isFalse(isExisting);
      })
      .pause(400) // Wait update
      .getText('[data-test=ListItemBodyRight] div:nth-child(2)', (err, text) => {
        assert.equal(text, '13,13 €');
      })
      .call(done);
  });

  it('should show account when we tap on it', (done) => {
    browser
      .click('[data-test=ListItem]')
      .waitForExist('.testAccountListMore', 1000, true) // Expense detail
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Alexandre Dupont');
      })
      .getText('[data-test=ListItemBody] span', (err, text) => {
        assert.deepEqual(text, [
          'Expense 2',
          'Expense 1',
        ]);
      })
      .call(done);
  });

  it('should show home when we close account', (done) => {
    browser
      .click('[data-test=AppBar] button') // Close
      .isExisting('[data-test=ExpenseSave]', (err, isExisting) => {
        assert.isFalse(isExisting);
      })
      .call(done);
  });

  it('should show home when we navigate back form account', (done) => {
    browser
      .click('[data-test=ListItem]')
      .waitForExist('[data-test=AppBar] button')
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Alexandre Dupont');
      })
      .keys('Left arrow')
      .isExisting('[data-test=ExpenseSave]', (err, isExisting) => {
        assert.isFalse(isExisting);
      })
      .call(done);
  });

  it('should show account when we navigate back from edit expense', (done) => {
    browser
      .click('[data-test=ListItem]')
      .waitForExist('.testAccountListMore', 1000, true) // Expense detail
      .click('[data-test=ListItem]')
      .waitForExist('[data-test=AppBar] button')
      .click('[data-test=AppBar] button') // Close
      .waitForExist('[data-test=ExpenseSave]', 1000, true)
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Alexandre Dupont');
      })
      .call(done);
  });

  it('should prefilled paidFor expense when we tap on add new expense', (done) => {
    browser
      .click('[data-test=MainActionButton]')
      .waitForExist('[data-test=ExpenseAddPaidFor]')
      .elements('[data-test=ExpenseAddPaidFor] [data-test=ListItem]', (err, res) => {
        assert.lengthOf(res.value, 2);
      })
      .call(done);
  });

  it('should hide the modal when we navigate back', (done) => {
    browser
      .click('[data-test=ExpenseSave]')
      .waitForExist('[data-test=ModalButton0]')
      .pause(400)
      .keys('Left arrow')
      .waitForExist('[data-test=ModalButton0]', 1000, true)
      .call(done);
  });

  it('should show account when we close new expense', (done) => {
    browser
      .click('[data-test=AppBar] button') // Close
      .waitForExist('[data-test=ExpenseSave]', 1000, true)
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Alexandre Dupont');
      })
      .keys('Left arrow')
      .call(done);
  });

  it('should work when we add an expense inside an account', (done) => {
    browser
      .click('[data-test=ListItem]')
      .waitForExist('.testAccountListMore', 1000, true) // Expense detail
      .click('[data-test=MainActionButton]')
      .refresh()
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Nouvelle dépense');
      })
      .then(() => {
        return browserAddExpense(browser, 'Expense 3', 3.13);
      })
      .getText('[data-test=ListItemBodyRight]', (err, text) => {
        assert.deepEqual(text, [
          '3,13 €',
          '13,13 €',
          '13,13 €',
        ]);
      })
      .keys('Left arrow')
      .call(done);
  });

  it('should show new account in the list when we add a new expense', (done) => {
    browser
      .execute(fixture.executePushState, 'http://local.splitme.net:8000/expense/add?locale=fr')
      .then(() => {
        return browserAddExpense(browser, 'Expense 4', 13.13);
      })
      .getText('[data-test=AppBar] h1', (err, text) => {
        assert.equal(text, 'Mes comptes');
      })
      .waitForExist('div:nth-child(2) > [data-test=ListItem]')
      .getText('[data-test=ListItemBodyRight] div:nth-child(2)', (err, text) => {
        assert.deepEqual(text, [
          '6,57 €',
          '14,17 €',
        ]);
      })
      .call(done);
  });
});
