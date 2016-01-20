import {assert} from 'chai';
import Immutable from 'immutable';

import fixture from '../fixture';

describe('detail account', () => {
  before((done) => {
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
      .url('http://local.splitme.net:8000/?locale=fr#/accounts')
      .timeoutsAsyncScript(5000)
      .executeAsync(fixture.executeAsyncDestroyAll) // node.js context
      .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account1.toJS(), expenses1.toJS()) // node.js context
      .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account2.toJS(), expenses2.toJS()) // node.js context
      .executeAsync(fixture.executeAsyncSaveAccountAndExpenses, account3.toJS(), expenses3.toJS()) // node.js context
      .call(done);
  });

  it('should show accounts well sorted when we display it', (done) => {
    browser
      .waitForExist('[data-test=ListItem]')
      .getText('[data-test=ListItemBody] span', (err, text) => {
        assert.deepEqual(text, [
          'User2',
          'User4',
          'User1',
        ]);
      })
      .call(done);
  });

  it('should show expenses well sorted when we display it', (done) => {
    browser
      .click('div:nth-child(3) > [data-test=ListItem]')
      .waitForExist('.testAccountListMore', 1000, true) // Expense detail
      .getText('[data-test=ListItemBody] span', (err, text) => {
        assert.deepEqual(text, [
          '2',
          '3',
          '1',
        ]);
      })
      .call(done);
  });

  it('should show the balance chart well sorted when we navigate to balance', (done) => {
    browser
      .click('[data-test=AccountDetailBalance]')
      .pause(400) // Wait annimation end
      .getText('[data-test=AccountBalanceChart]', (err, text) => {
        assert.deepEqual(text, [
          '8,87 €',
          '-4,44 €',
          '-4,44 €',
        ]);
      })
      .call(done);
  });

  it('should show the good amount to be transfer when we navigate to debts', (done) => {
    browser
      .click('[data-test=AccountDetailDebts]')
      .getText('[data-test=ListSubheader]', (err, text) => {
        assert.deepEqual(text, undefined);
      })
      .pause(400) // Wait annimation end
      .getText('[data-test=AccountTransfer] div:nth-child(2)', (err, text) => {
        assert.deepEqual(text, [
          '4,44 €',
          '4,44 €',
        ]);
      })
      .call(done);
  });

  it('should show home when we navigate back', (done) => {
    browser
    .keys('Left arrow')
    .waitForExist('.testAccountListMore') // Home
    .getText('[data-test=AppBar] h1', (err, text) => {
      assert.equal(text, 'Mes comptes');
    })
    .call(done);
  });

  it('should show two balance chart when we have two currency', (done) => {
    browser
      .click('div:nth-child(1) > [data-test=ListItem]')
      .waitForExist('[data-test=AccountDetailBalance]')
      .click('[data-test=AccountDetailBalance]')
      .pause(400) // Wait annimation end
      .getText('[data-test=AccountBalance] [data-test=ListSubheader]', (err, text) => {
        assert.deepEqual(text, [
          'En EUR',
          'En USD',
        ]);
      })
      .getText('[data-test=AccountBalanceChart]', (err, text) => {
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

  it('should show two amounts to be transfer when we navigate to debts', (done) => {
    browser
      .click('[data-test=AccountDetailDebts]')
      .getText('[data-test=AccountDebts] [data-test=ListSubheader]', (err, text) => {
        assert.deepEqual(text, [
          'En EUR',
          'En USD',
        ]);
      })
      .getText('[data-test=AccountTransfer] div:nth-child(2)', (err, text) => {
        assert.deepEqual(text, [
          '6,66 €',
          '4,44 $US',
          '4,44 $US',
        ]);
      })
      .call(done);
  });

  it('should show correctly balance value when the balance is close to zero', (done) => {
    browser
      .keys('Left arrow')
      .waitForExist('.testAccountListMore') // Home
      .getText('div:nth-child(2) > [data-test=ListItem] [data-test=ListItemBodyRight]', (err, text) => {
        assert.equal(text, 'vous doit\n6,66 $US'); // No EUR
      })
      .click('div:nth-child(2) > [data-test=ListItem]')
      .waitForExist('[data-test=AccountDetailBalance]')
      .click('[data-test=AccountDetailBalance]')
      .pause(400) // Wait annimation end
      .getText('[data-test=AccountBalanceChart]', (err, text) => {
        assert.deepEqual(text, [
          '0,00 €',
          '0,00 €',
          '6,66 $US',
          '-6,66 $US',
        ]);
      })
      .click('[data-test=AccountDetailDebts]')
      .getText('[data-test=AccountDebts] [data-test=ListSubheader]', (err, text) => {
        assert.deepEqual(text, undefined);
      })
      .pause(400) // Wait annimation end
      .getText('[data-test=AccountTransfer] div:nth-child(2)', (err, text) => {
        assert.equal(text, [
          '6,66 $US',
        ]);
      })
      .call(done);
  });


});
