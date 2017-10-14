import React from 'react';
import { assert } from 'chai';
import { match, Route, IndexRoute } from 'react-router';
import utils from './utils';

function getRenderProps(location, routes, callback) {
  match(
    {
      routes,
      location,
    },
    (error, redirectLocation, renderProps) => {
      callback(renderProps);
    },
  );
}

describe('utils', () => {
  describe('#getRoutesPath()', () => {
    const routes = (
      <Route path="/">
        <IndexRoute />
        <Route path="expense/add" />
        <Route path="account">
          <Route path="add" />
          <Route path=":id/expenses" />
          <Route path=":id/expense/:expenseId/edit" />
        </Route>
      </Route>
    );

    it('should work with the root path', done => {
      getRenderProps('/', routes, renderProps => {
        const path = utils.getRoutesPath(renderProps);
        assert.strictEqual(path, '/');
        done();
      });
    });

    it('should work with a first level path', done => {
      getRenderProps('/expense/add', routes, renderProps => {
        const path = utils.getRoutesPath(renderProps);
        assert.strictEqual(path, '/expense/add');
        done();
      });
    });

    it('should work with a nested level path', done => {
      getRenderProps('/account/add', routes, renderProps => {
        const path = utils.getRoutesPath(renderProps);
        assert.strictEqual(path, '/account/add');
        done();
      });
    });

    it('should work with a nested level path and with a variable', done => {
      getRenderProps('/account/10123/expenses', routes, renderProps => {
        const path = utils.getRoutesPath(renderProps);
        assert.strictEqual(path, '/account/:id/expenses');
        done();
      });
    });
  });
});
