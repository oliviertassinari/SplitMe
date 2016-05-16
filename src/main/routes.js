import {
  Route,
  IndexRoute,
} from 'react-router';
import React from 'react';

import Main from 'main/Main';
import getAsync from 'main/getAsync';

const ENSURE_AHEAD_DELAY = 1500;
let lazyRouteName;
let timer;

function loadProductHome(loaded = () => {}) {
  require.ensure(['main/product/Home'], (require) => {
    loaded(require('main/product/Home').default);
  });
}

function loadAccountList(loaded = () => {}) {
  require.ensure(['main/account/List'], (require) => {
    loaded(require('main/account/List').default);
  });
}

function loadSettings(loaded = () => {}) {
  require.ensure(['main/settings/Settings'], (require) => {
    loaded(require('main/settings/Settings').default);
  });
}

function loadAccountDetail(loaded = () => {}) {
  require.ensure(['main/account/detail/Detail'], (require) => {
    loaded(require('main/account/detail/Detail').default);
  });
}

function loadAccountAdd(loaded = () => {}) {
  require.ensure(['main/account/add/Add'], (require) => {
    loaded(require('main/account/add/Add').default);
  });
}

function loadExpenseAdd(loaded = () => {}) {
  require.ensure(['main/expense/add/Add'], (require) => {
    loaded(require('main/expense/add/Add').default);
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
        require.ensure(['main/NotFound'], (require) => {
          callback(require('main/NotFound').default);
        });
    }

    lazyRouteName = name;
  };
}


const AccountDetail = getAsync(lasyLoad('AccountDetail'));
const AccountList = getAsync(lasyLoad('AccountList'));
const Settings = getAsync(lasyLoad('Settings'));
import SettingsImport from 'main/settings/Import';
import SettingsExport from 'main/settings/Export';
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
    <Route path="settings" component={Settings}>
      <Route path="import" component={SettingsImport} />
      <Route path="export" component={SettingsExport} />
    </Route>
    <Route path="expense/add" component={ExpenseAdd} />
    <Route path="account">
      <Route path="add" component={AccountAdd} />
      <Route path=":id/expenses" component={AccountDetail} />
      <Route path=":id/expense/:expenseId/edit" component={ExpenseAdd} />
      <Route path=":id/expense/add" component={ExpenseAdd} />
      <Route path=":id/balance" component={AccountDetail} />
      <Route path=":id/debt" component={AccountDetail} />
      <Route path=":id/edit" component={AccountAdd} />
    </Route>
    {ProductHomeRoute}
    <Route path="*" component={NotFound} />
  </Route>
);
