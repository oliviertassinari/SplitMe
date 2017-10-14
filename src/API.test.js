/* eslint-env mocha */

import Immutable from 'immutable';
import { assert } from 'chai';
import fixture from '../test/fixture';
import API from './API';

describe('API', () => {
  describe('global', () => {
    before(() => {
      return API.setUpDataBase();
    });

    after(() => {
      return API.destroyDb();
    });

    describe('#putAccount()', () => {
      it('should store correctly when we call give an account with expenses', () => {
        let account = fixture.getAccount({
          members: [
            {
              name: 'AccountName',
              id: '10',
            },
          ],
        });
        account = account.set(
          'expenses',
          Immutable.fromJS([
            {
              _id: 'id1',
              amount: 13,
              // And more
            },
            'id2',
          ]),
        );

        return API.putAccount(account)
          .then(accountAdded => {
            return API.fetch(accountAdded.get('_id'));
          })
          .then(accountFetched => {
            const expenses = accountFetched.get('expenses');

            assert.strictEqual(expenses.size, 2);
            assert.strictEqual(expenses.get(0), 'id1');
            assert.strictEqual(expenses.get(1), 'id2');
          });
      });
    });

    describe('#fetchAccountsByMemberId()', () => {
      it('should return the account when we give the id of a member', () => {
        return API.fetchAccountsByMemberId('10').then(accounts => {
          assert.strictEqual(accounts.getIn([0, 'name']), 'AccountName');
        });
      });
    });

    describe('#putExpense()', () => {
      it('should store correctly when we give an expense', () => {
        const expense = fixture.getExpense({
          paidForContactIds: ['10'],
        });

        return API.putExpense(expense)
          .then(expenseAdded => {
            return API.fetch(expenseAdded.get('_id'));
          })
          .then(expenseFetched => {
            assert.strictEqual(expenseFetched.getIn(['paidFor', 1, 'contactId']), '10');
          });
      });
    });

    describe('#fetchExpensesOfAccount()', () => {
      let account;

      before(() => {
        account = fixture.getAccount({
          members: [
            {
              name: 'AccountName',
              id: '10',
            },
          ],
        });

        const expense = fixture.getExpense({
          paidForContactIds: ['10'],
        });

        return API.putExpense(expense)
          .then(expenseAdded => {
            account = account.set('expenses', [expenseAdded]);
            return API.putAccount(account);
          })
          .then(accountAdded => {
            account = accountAdded;
          });
      });

      it('should fetch the expenses of the account correctly', () => {
        return API.fetch(account.get('_id'))
          .then(accountFetched => {
            return API.fetchExpensesOfAccount(accountFetched);
          })
          .then(accountWithExpenses => {
            assert.strictEqual(accountWithExpenses.get('expenses').size, 1);
            assert.isObject(accountWithExpenses.getIn(['expenses', 0]).toJS());
          });
      });

      it('should only fetch the expenses that need it', () => {
        const expense = Immutable.fromJS(fixture.getExpense());

        return API.fetch(account.get('_id'))
          .then(accountFetched => {
            accountFetched = accountFetched.update('expenses', expenses => {
              return expenses.push(expense);
            });

            return API.fetchExpensesOfAccount(accountFetched);
          })
          .then(accountWithExpenses => {
            assert.strictEqual(accountWithExpenses.get('expenses').size, 2);
            assert.isObject(accountWithExpenses.getIn(['expenses', 0]).toJS());
            assert.strictEqual(accountWithExpenses.getIn(['expenses', 1]), expense);
          });
      });
    });

    describe('#removeAccount()', () => {
      it('should not see the account when we remove it', () => {
        return API.fetchAccountAll()
          .then(accounts => {
            assert.strictEqual(accounts.size, 2);

            return API.fetchExpensesOfAccount(accounts.get(1));
          })
          .then(accountWithExpenses => {
            return API.removeAccount(accountWithExpenses);
          })
          .then(() => {
            return API.fetchAccountAll();
          })
          .then(accounts => {
            assert.strictEqual(accounts.size, 1);
          });
      });

      it('should work correctly when there is no expense', () => {
        const account = fixture.getAccount({
          members: [
            {
              name: 'AccountName',
              id: '10',
            },
          ],
        });

        return API.putAccount(account)
          .then(accountAdded => {
            return API.removeAccount(accountAdded);
          })
          .then(() => {
            return API.fetchAccountAll();
          })
          .then(accounts => {
            assert.strictEqual(accounts.size, 1);
          });
      });
    });

    describe('#isExpensesFetched()', () => {
      it('should return true if there is not expenses', () => {
        assert.strictEqual(API.isExpensesFetched(Immutable.fromJS([])), true);
      });

      it('should return true if all the expenses are fetched', () => {
        assert.strictEqual(
          API.isExpensesFetched(Immutable.fromJS([fixture.getExpense(), fixture.getExpense()])),
          true,
        );
      });

      it("should return false if all the expenses aren't fetched", () => {
        assert.strictEqual(
          API.isExpensesFetched(
            Immutable.fromJS(['expense_1_1462707969172', 'expense_1_1462707969173']),
          ),
          false,
        );
      });

      it("should return false if one expense isn't fetched", () => {
        assert.strictEqual(
          API.isExpensesFetched(
            Immutable.fromJS([fixture.getExpense(), 'expense_1_1462707969173']),
          ),
          false,
        );
      });
    });

    describe('#export', () => {
      it('should export some data', () => {
        return API.export().then(data => {
          assert.strictEqual(data.length > 0, true, 'should not be empty');
        });
      });
    });
  });

  describe('#import', () => {
    before(() => {
      return API.setUpDataBase();
    });

    after(() => {
      return API.destroyDb();
    });

    it('should import some data', () => {
      return API.import(fixture.getRawDate())
        .then(() => {
          return API.fetchAccountAll();
        })
        .then(accounts => {
          assert.strictEqual(accounts.size, 1);
        });
    });

    it('should fail when import wrongly formatted data', () => {
      return API.import('test')
        .then(() => {
          return API.fetchAccountAll();
        })
        .catch(error => {
          assert.strictEqual(error.toString(), 'Error: Could not parse row test...');
        });
    });
  });
});
