import RouteParser from 'route-parser';

export default {
  accountAdd: new RouteParser('/account/:id/edit'),
  expenseEdit: new RouteParser('/account/:id/expense/:expenseId/edit'),
  expenseAdd: new RouteParser('/account/:id/expense/add'),
  accountDetail: new RouteParser('/account/:id/expenses'),
};
