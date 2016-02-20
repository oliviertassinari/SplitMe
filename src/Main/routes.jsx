import {
  Route,
  IndexRoute,
} from 'react-router';
import React from 'react';

import Main from 'Main/Main';
import AccountList from 'Main/Account/List';
import AccountDetail from 'Main/Account/Detail';
import AccountAdd from 'Main/Account/Add/Add';
import ExpenseAdd from 'Main/Expense/Add';
import Settings from 'Main/Settings/Settings';

let ProductHomeRoute;

if (process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') {
  const ProductHome = require('Main/Product/Home').default;

  ProductHomeRoute = <Route path=":locale" component={ProductHome} />;
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
  </Route>
);
