'use strict';

const {
  Route,
  IndexRoute,
} = require('react-router');
const React = require('react');

const Main = require('Main/Main');
const AccountList = require('Main/Account/List');
const AccountDetail = require('Main/Account/Detail');
const AccountAdd = require('Main/Account/Add/Add');
const ExpenseAdd = require('Main/Expense/Add');
const Settings = require('Main/Settings/Settings');

module.exports = (
  <Route path="/" component={Main}>
    <IndexRoute component={AccountList} />
    <Route path="settings" component={Settings} />
    <Route path="expense/add" component={ExpenseAdd} />
    <Route path="account/add" component={AccountAdd} />
    <Route path="account/:id/expenses" component={AccountDetail} />
    <Route path="account/:id/expense/:expenseId/edit" component={ExpenseAdd} />
    <Route path="account/:id/expense/add" component={ExpenseAdd} />
    <Route path="account/:id/balance" component={AccountDetail} />
    <Route path="account/:id/debt" component={AccountDetail} />
    <Route path="account/:id/edit" component={AccountAdd} />
  </Route>
);
