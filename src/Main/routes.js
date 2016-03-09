import {
  Route,
  IndexRoute,
} from 'react-router';
import React from 'react';

import Main from 'Main/Main';
import getAsync from 'Main/getAsync';

const ENSURE_AHEAD_DELAY = 1500;
let lazyRouteName;
let timer;

function loadProductHome(loaded = () => {}) {
  require.ensure(['Main/Product/Home'], (require) => {
    loaded(require('Main/Product/Home').default);
  });
}

function loadAccountList(loaded = () => {}) {
  require.ensure(['Main/Account/List'], (require) => {
    loaded(require('Main/Account/List').default);
  });
}

function loadSettings(loaded = () => {}) {
  require.ensure(['Main/Settings/Settings'], (require) => {
    loaded(require('Main/Settings/Settings').default);
  });
}

function loadAccountDetail(loaded = () => {}) {
  require.ensure(['Main/Account/Detail'], (require) => {
    loaded(require('Main/Account/Detail').default);
  });
}

function loadAccountAdd(loaded = () => {}) {
  require.ensure(['Main/Account/Add/Add'], (require) => {
    loaded(require('Main/Account/Add/Add').default);
  });
}

function loadExpenseAdd(loaded = () => {}) {
  require.ensure(['Main/Expense/Add'], (require) => {
    loaded(require('Main/Expense/Add').default);
  });
}

export function getLazyRouteName() {
  return lazyRouteName;
}

export function lasyLoad(name) {
  return (callback) => {
    clearTimeout(timer);

    switch (name) {
      case 'ProductHome':
        loadProductHome(callback);

        timer = setTimeout(() => {
          loadAccountList();
        }, ENSURE_AHEAD_DELAY);
        break;
      case 'AccountList':
        loadAccountList(callback);

        timer = setTimeout(() => {
          loadSettings();
          loadAccountDetail();
          loadAccountAdd();
          loadExpenseAdd();
        }, ENSURE_AHEAD_DELAY);
        break;

      case 'Settings':
        loadSettings(callback);

        timer = setTimeout(() => {
          loadAccountList();
        }, ENSURE_AHEAD_DELAY);
        break;

      case 'AccountDetail':
        loadAccountDetail(callback);

        timer = setTimeout(() => {
          loadAccountList();
          loadAccountAdd();
          loadExpenseAdd();
        }, ENSURE_AHEAD_DELAY);
        break;

      case 'AccountAdd':
        loadAccountAdd(callback);

        timer = setTimeout(() => {
          loadAccountDetail();
        }, ENSURE_AHEAD_DELAY);
        break;

      case 'ExpenseAdd':
        loadExpenseAdd(callback);

        timer = setTimeout(() => {
          loadAccountList();
          loadAccountDetail();
        }, ENSURE_AHEAD_DELAY);
        break;

      case 'NotFound':
        require.ensure(['Main/NotFound'], (require) => {
          callback(require('Main/NotFound').default);
        });
    }

    lazyRouteName = name;
  };
}

const AccountDetail = getAsync(lasyLoad('AccountDetail'));
const AccountList = getAsync(lasyLoad('AccountList'));
const Settings = getAsync(lasyLoad('Settings'));
const ExpenseAdd = getAsync(lasyLoad('ExpenseAdd'));
const AccountAdd = getAsync(lasyLoad('AccountAdd'));
const NotFound = getAsync(lasyLoad('NotFound'));

let ProductHomeRoute;

if (process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') {
  ProductHomeRoute = <Route path=":locale" component={getAsync(lasyLoad('ProductHome'))} />;
}

export default (
  <Route path="/" component={Main}>
    <IndexRoute component={AccountList} />
    <Route path="accounts" component={AccountList} />
    <Route path="settings" component={Settings} />
    <Route path="expense/add" component={ExpenseAdd} />
    <Route path="account/add" component={AccountAdd} />
    <Route path="account/:id/expenses" component={AccountDetail} />
    <Route path="account/:id/expense/:expenseId/edit" component={ExpenseAdd} />
    <Route path="account/:id/expense/add" component={ExpenseAdd} />
    <Route path="account/:id/balance" component={AccountDetail} />
    <Route path="account/:id/debt" component={AccountDetail} />
    <Route path="account/:id/edit" component={AccountAdd} />
    {ProductHomeRoute}
    <Route path="*" component={NotFound} />
  </Route>
);
