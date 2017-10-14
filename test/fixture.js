/* eslint-disable max-len */

import Immutable from 'immutable';

const fixture = {
  getAccount(options = {}) {
    const {
      members = [
        {
          name: 'MyTrip',
          id: '1',
        },
      ],
    } = options;

    const account = {
      name: members[0].name,
      dateLatestExpense: null,
      expenses: [],
      members: [
        {
          // Me always on 1st position
          id: '0', // Me
          balances: [],
        },
      ],
    };

    for (let i = 0; i < members.length; i += 1) {
      const member = members[i];

      account.members.push({
        id: member.id,
        name: member.name,
        balances: [],
      });
    }

    return Immutable.fromJS(account);
  },
  getExpense(options = {}) {
    const {
      description = 'description',
      amount = 13.31,
      currency = 'EUR',
      date = '2015-03-22',
      paidByContactId = '0',
      paidForContactIds = ['10'],
    } = options;

    const expense = {
      description,
      amount,
      currency,
      date,
      paidByContactId,
      split: 'equaly',
      paidFor: [
        {
          contactId: '0',
          split_equaly: true,
        },
      ],
    };

    paidForContactIds.forEach(contactId => {
      expense.paidFor.push({
        contactId,
        split_equaly: true,
      });
    });

    return Immutable.fromJS(expense);
  },
  getExpenseEqualy1() {
    return Immutable.fromJS({
      description: 'description',
      amount: 13.31,
      currency: 'EUR',
      date: '2015-03-21',
      paidByContactId: '0',
      split: 'equaly',
      paidFor: [
        {
          contactId: '0',
          split_equaly: true,
        },
        {
          contactId: '10',
          split_equaly: true,
        },
        {
          contactId: '11',
          split_equaly: true,
        },
      ],
    });
  },
  getExpenseEqualy2() {
    return Immutable.fromJS({
      description: 'description',
      amount: 13.31,
      currency: 'EUR',
      paidByContactId: '0',
      date: '2015-03-21',
      split: 'equaly',
      paidFor: [
        {
          contactId: '0',
          split_equaly: true,
        },
        {
          contactId: '10',
          split_equaly: true,
        },
        {
          contactId: '11',
          split_equaly: false,
        },
      ],
    });
  },
  getExpenseUnequaly() {
    return Immutable.fromJS({
      description: 'description',
      amount: 23.51,
      currency: 'EUR',
      paidByContactId: '0',
      date: '2015-03-21',
      split: 'unequaly',
      paidFor: [
        {
          contactId: '0',
          split_unequaly: 11.2,
        },
        {
          contactId: '10',
          split_unequaly: 12.31,
        },
      ],
    });
  },
  getExpenseShares() {
    return Immutable.fromJS({
      description: 'description',
      amount: 13.31,
      currency: 'EUR',
      paidByContactId: '0',
      date: '2015-03-21',
      split: 'shares',
      paidFor: [
        {
          contactId: '0',
          split_shares: 2,
        },
        {
          contactId: '10',
          split_shares: 3,
        },
      ],
    });
  },
  getMembersWhereBalanceComplexe() {
    return Immutable.fromJS([
      {
        id: '0',
        balances: [
          {
            currency: 'EUR',
            value: -10,
          },
        ],
      },
      {
        id: '1',
        balances: [
          {
            currency: 'EUR',
            value: 30,
          },
        ],
      },
      {
        id: '2',
        balances: [
          {
            currency: 'EUR',
            value: -50,
          },
        ],
      },
      {
        id: '3',
        balances: [
          {
            currency: 'EUR',
            value: 30,
          },
        ],
      },
      {
        id: '4',
        balances: [
          {
            currency: 'USD',
            value: 30,
          },
        ],
      },
    ]);
  },
  getRawDate() {
    return [
      '{"version":"1.2.4","db_type":"idb","start_time":"2015-09-01T21:47:37.478Z","db_info":',
      '{"doc_count":3,"update_seq":4,"idb_attachment_format":"binary","db_name":"db",',
      '"auto_compaction":false,"adapter":"idb"}}\n',
      '{"docs":[{"_id":"_design/by_member_id","_rev":"1-5ff854963afbaefb5b22cf96a28a3bcc",',
      '"views":{"by_member_id":{"map":"function (doc) {',
      "if (doc._id.substring(0, 7) === 'account') {",
      'emit(doc.members[1].id);}}"}}}]}\n',
      '{"seq":1}\n',
      '{"docs":[{"dateUpdated":1441144027,"account":null,"date":"2015-09-01","currency":"EUR",',
      '"amount":1,"paidByContactId":"0","split":"equaly","dateCreated":1441144027,"description":',
      '"expense 1","_id":"expense_1_1441144037660","_rev":"1-afde2d295ecfba7f3b5ddad18b317182",',
      '"paidFor":[{"contactId":"0","split_equaly":true,"split_unequaly":null,"split_shares":1},',
      '{"contactId":"1441144035160","split_equaly":true,"split_unequaly":null,"split_shares":1}]}]}\n',
      '{"seq":2}\n',
      '{"docs":[{"name":"Test import / export","share":false,"dateLatestExpense":',
      '"2015-09-01","couchDBDatabaseName":null,"_id":"account_1_1441144037685","_rev":',
      '"2-04d8d80b5dc795eb9ade310d20d51878","_revisions":{"start":2,"ids":',
      '["04d8d80b5dc795eb9ade310d20d51878","99219706faff75543274a74c8a6b2e56"]},"expenses":',
      '["expense_1_1441144037660"],"members":[{"id":"0","name":null,"email":null,"photo":null,',
      '"balances":[{"currency":"EUR","value":0.5}]},{"id":"1441144035160","name":',
      '"Alexandre Dupont","email":null,"photo":"https://avatars1.githubusercontent.com',
      '/u/3165635?v=3&s=140","balances":[{"currency":"EUR","value":-0.5}]}]}]}\n',
      '{"seq":4}\n',
    ].join('');
  },
  // Browser context, sent in a new scope
  executeAsyncDestroyAll(done) {
    const API = window.tests.API;

    API.destroyDb()
      .then(() => {
        return API.setUpDataBase();
      })
      .then(done);
  },
  // Browser context, sent in a new scope
  executeAsyncSaveAccountAndExpenses(account, expenses, done) {
    const immutable = window.tests.immutable;
    const fixtureBrowser = window.tests.fixtureBrowser;

    fixtureBrowser
      .saveAccountAndExpenses(immutable.fromJS(account), immutable.fromJS(expenses))
      .then(accountSaved => {
        done({
          account: accountSaved.toJS(),
        });
      });
  },
  executeSetValue(selector, value) {
    const element = document.querySelector(selector);

    if (element instanceof HTMLTextAreaElement) {
      element.value = value;
    }
  },
  executePushState(url) {
    window.tests.history.push(url);
  },
};

export default fixture;
