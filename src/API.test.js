import Immutable from 'immutable';
import {assert} from 'chai';

import fixture from '../test/fixture';
import API from './API';

describe('API', () => {
  before((done) => {
    API.destroyAll()
      .then(() => done())
      .catch((err) => {
        throw new Error(err);
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

          assert.strictEqual(expenses.size, 2);
          assert.strictEqual(expenses.get(0), 'id1');
          assert.strictEqual(expenses.get(1), 'id2');
          done();
        });
    });
  });

  describe('#fetchAccountsByMemberId()', () => {
    it('should return the account when we give the id of a member', (done) => {
      API.fetchAccountsByMemberId('10').then((accounts) => {
        assert.strictEqual(accounts.getIn([0, 'name']), 'AccountName');
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
          assert.strictEqual(expenseFetched.getIn(['paidFor', 1, 'contactId']), '10');
          done();
        });
    });
  });

  describe('#fetchExpensesOfAccount()', () => {
    let account;

    before((done) => {
      account = fixture.getAccount([{
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
          account = accountAdded;
          done();
        });
    });

    it('should fetch the expenses of the account correctly', (done) => {
      API.fetch(account.get('_id'))
        .then((accountFetched) => {
          return API.fetchExpensesOfAccount(accountFetched);
        })
        .then((accountWithExpenses) => {
          assert.strictEqual(accountWithExpenses.get('expenses').size, 1);
          assert.isObject(accountWithExpenses.getIn(['expenses', 0]).toJS());
          done();
        });
    });

    it('should only fetch the expenses that need it', (done) => {
      const expense = Immutable.fromJS(fixture.getExpense());

      API.fetch(account.get('_id'))
        .then((accountFetched) => {
          accountFetched = accountFetched.update('expenses', (expenses) => {
            return expenses.push(expense);
          });

          return API.fetchExpensesOfAccount(accountFetched);
        })
        .then((accountWithExpenses) => {
          assert.strictEqual(accountWithExpenses.get('expenses').size, 2);
          assert.isObject(accountWithExpenses.getIn(['expenses', 0]).toJS());
          assert.strictEqual(accountWithExpenses.getIn(['expenses', 1]), expense);
          done();
        });
    });
  });

  describe('#removeAccount()', () => {
    it('should not see the account when we remove it', (done) => {
      API.fetchAccountAll()
        .then((accounts) => {
          assert.strictEqual(accounts.size, 2);

          return API.fetchExpensesOfAccount(accounts.get(1));
        })
        .then((accountWithExpenses) => {
          return API.removeAccount(accountWithExpenses);
        })
        .then(() => {
          return API.fetchAccountAll();
        })
        .then((accounts) => {
          assert.strictEqual(accounts.size, 1);
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
          assert.strictEqual(accounts.size, 1);
          done();
        });
    });
  });

  describe('#isExpensesFetched()', () => {
    it('should return true if there is not expenses', () => {
      assert.strictEqual(
        API.isExpensesFetched(Immutable.fromJS([])),
        true,
      );
    });

    it('should return true if all the expenses are fetched', () => {
      assert.strictEqual(
        API.isExpensesFetched(Immutable.fromJS([
          fixture.getExpense(),
          fixture.getExpense(),
        ])),
        true,
      );
    });

    it("should return false if all the expenses aren't fetched", () => {
      assert.strictEqual(
        API.isExpensesFetched(Immutable.fromJS([
          'expense_1_1462707969172',
          'expense_1_1462707969173',
        ])),
        false,
      );
    });

    it("should return false if one expense isn't fetched", () => {
      assert.strictEqual(
        API.isExpensesFetched(Immutable.fromJS([
          fixture.getExpense(),
          'expense_1_1462707969173',
        ])),
        false,
      );
    });
  });
});
