'use strict';

var API = require('API');
var accountActions = require('Main/Account/actions');

var actions = {
  show: function(actionsName, title) {
    return {
      type: 'MODAL_UPDATE',
      actions: actionsName,
      title: title,
    };
  },
  tapOK: function(triggerName) {
    return function(dispatch, getState) {
      var state = getState();

      dispatch({
        type: 'MODAL_TAP_OK',
        triggerName: triggerName,
      });

      var newState = getState();

      if (triggerName === 'deleteExpenseCurrent') {
        dispatch(accountActions.replaceAccount(
          newState.get('accountCurrent'), newState.get('accountOpened'), true, true));

        API.removeExpense(state.get('expenseCurrent'));
      }
    };
  },
  dismiss: function() {
    return {
      type: 'MODAL_DISMISS',
    };
  },
};

module.exports = actions;
