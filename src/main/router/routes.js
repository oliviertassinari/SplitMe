import { Route, IndexRoute } from 'react-router';
import React from 'react';
import locale from 'locale';
import Main from 'main/Main';
import MainApp from 'main/MainApp';
import getAsync from 'main/router/getAsync';
import Shell from 'modules/components/Shell';
import SettingsImport from 'main/settings/Import';
import SettingsExport from 'main/settings/Export';

const ENSURE_AHEAD_DELAY = 2000; // ms
let lazyRouteName;
let timer;

export function getLazyRouteName() {
  return lazyRouteName;
}

const ASYNC_ROUTE_NAMES = {
  ProductHome: () => {},
  AccountList: callback => {
    require.ensure(['main/account/List'], require => {
      callback(require('main/account/List'));
    });
  },
  Settings: callback => {
    require.ensure(['main/settings/Settings'], require => {
      callback(require('main/settings/Settings'));
    });
  },
  AccountDetail: callback => {
    require.ensure(['main/account/detail/Detail'], require => {
      callback(require('main/account/detail/Detail'));
    });
  },
  AccountAdd: callback => {
    require.ensure(['main/account/add/Add'], require => {
      callback(require('main/account/add/Add'));
    });
  },
  ExpenseAdd: callback => {
    require.ensure(['main/expense/add/Add'], require => {
      callback(require('main/expense/add/Add'));
    });
  },
  NotFound: callback => {
    require.ensure(['main/NotFound'], require => {
      callback(require('main/NotFound'));
    });
  },
};

export function lasyLoad(routeName) {
  return callback => {
    // Preload all the routes.
    if (process.env.PLATFORM === 'browser') {
      clearTimeout(timer);

      timer = setTimeout(() => {
        Object.keys(ASYNC_ROUTE_NAMES).forEach(routeName2 => {
          ASYNC_ROUTE_NAMES[routeName2](() => {});
        });
      }, ENSURE_AHEAD_DELAY);
    }

    ASYNC_ROUTE_NAMES[routeName](module => {
      callback(module.default);
    });

    lazyRouteName = routeName;
  };
}

const AccountDetail = getAsync(lasyLoad('AccountDetail'));
const AccountList = getAsync(lasyLoad('AccountList'));
const Settings = getAsync(lasyLoad('Settings'));
const ExpenseAdd = getAsync(lasyLoad('ExpenseAdd'));
const AccountAdd = getAsync(lasyLoad('AccountAdd'));

let ProductHomeRoute;

if (process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') {
  ASYNC_ROUTE_NAMES.ProductHome = callback => {
    require.ensure(['main/product/Home'], require => {
      callback(require('main/product/Home'));
    });
  };

  ProductHomeRoute = (
    <Route
      path=":locale"
      component={getAsync(lasyLoad('ProductHome'))}
      onEnter={(nextState, replace) => {
        if (locale.available.indexOf(nextState.params.locale) === -1) {
          replace('/en');
        }
      }}
    />
  );
}

export default (
  <Route path="/" component={Main}>
    <Route component={MainApp}>
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
    </Route>
    <Route path="shell" component={Shell} />
    {ProductHomeRoute}
    <Route path="*" component={getAsync(lasyLoad('NotFound'))} />
  </Route>
);
