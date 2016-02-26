import {
  Route,
  IndexRoute,
} from 'react-router';
import React from 'react';

import Main from 'Main/Main';
import lazy from 'lazy';

const AccountDetail = lazy('AccountDetail');
const AccountList = lazy('AccountList');
const Settings = lazy('Settings');
const ExpenseAdd = lazy('ExpenseAdd');
const AccountAdd = lazy('AccountAdd');

let ProductHomeRoute;

if (process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') {
  ProductHomeRoute = <Route path=":locale" component={lazy('ProductHome')} />;
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
