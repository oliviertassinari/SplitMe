const Immutable = require('immutable');
const assert = require('chai').assert;
const path = require('path');
require('app-module-path').addPath(path.join(__dirname, ''));

const fixture = require('../test/fixture');
const API = require('API');

describe('API', () => {
  // runs before all tests in this block
  before((done) => {
    API.destroyAll().then(() => {
      done();
    }).catch((err) => {
      console.log(err);
    });
  });

  describe('#putAccount()', () => {
    it('should store correctly when we call give an account with expenses', (done) => {
      let account = fixture.getAccount([{
        name: 'AccountName',
        id: '10',
      }]);
      account = account.set('expenses', Immutable.fromJS([
        {
          _id: 'id1',
          amount: 13,
          // And more
        },
        'id2',
      ]));

      API.putAccount(account)
        .then((accountAdded) => {
          return API.fetch(accountAdded.get('_id'));
        })
        .then((accountFetched) => {
          const expenses = accountFetched.get('expenses');

          assert.equal(expenses.size, 2);
          assert.equal(expenses.get(0), 'id1');
          assert.equal(expenses.get(1), 'id2');
          done();
        });
    });
  });

  describe('#fetchAccountsByMemberId()', () => {
    it('should return the account when we give the id of a member', (done) => {
      API.fetchAccountsByMemberId('10').then((accounts) => {
        assert.equal(accounts.getIn([0, 'name']), 'AccountName');
        done();
      });
    });
  });

  describe('#putExpense()', () => {
    it('should store correctly when we give an expense', (done) => {
      const expense = fixture.getExpense({
        paidForContactIds: ['10'],
      });

      API.putExpense(expense)
        .then((expenseAdded) => {
          return API.fetch(expenseAdded.get('_id'));
        })
        .then((expenseFetched) => {
          assert.equal(expenseFetched.getIn(['paidFor', 1, 'contactId']), '10');
          done();
        });
    });
  });

  describe('#fetchExpensesOfAccount()', () => {
    it('should fetch the expenses of the account correctly when give an account', (done) => {
      let account = fixture.getAccount([{
        name: 'AccountName',
        id: '10',
      }]);

      const expense = fixture.getExpense({
        paidForContactIds: ['10'],
      });

      API.putExpense(expense)
        .then((expenseAdded) => {
          account = account.set('expenses', [expenseAdded]);
          return API.putAccount(account);
        })
        .then((accountAdded) => {
          return API.fetch(accountAdded.get('_id'));
        })
        .then((accountFetched) => {
          return API.fetchExpensesOfAccount(accountFetched)
            .then((accountWithExpenses) => {
              assert.equal(accountWithExpenses.get('expenses').size, 1);
              assert.isObject(accountWithExpenses.getIn(['expenses', 0]).toJS());
              done();
            });
        });
    });
  });

  describe('#removeAccount()', () => {
    it('should not see the account when we remove it', (done) => {
      API.fetchAccountAll()
        .then((accounts) => {
          assert.equal(accounts.size, 2);

          return API.fetchExpensesOfAccount(accounts.get(1));
        })
        .then((accountWithExpenses) => {
          return API.removeAccount(accountWithExpenses);
        })
        .then(() => {
          return API.fetchAccountAll();
        })
        .then((accounts) => {
          assert.equal(accounts.size, 1);
          done();
        });
    });
    it('should work correctly when there is no expense', (done) => {
      const account = fixture.getAccount([{
        name: 'AccountName',
        id: '10',
      }]);

      API.putAccount(account)
        .then((accountAdded) => {
          return API.removeAccount(accountAdded);
        })
        .then(() => {
          return API.fetchAccountAll();
        })
        .then((accounts) => {
          assert.equal(accounts.size, 1);
          done();
        });
    });
  });
});
