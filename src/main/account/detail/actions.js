import API from 'API';
import actionTypes from 'redux/actionTypes';
import accountActions from 'main/account/actions';
import accountUtils from 'main/account/utils';

const accountDetailActions = {
  fetch(accountId) {
    return (dispatch, getState) => {
      return dispatch(accountActions.fetchList()).then(() => {
        const state = getState();
        const accountEntry = accountUtils.findEntry(
          state.getIn(['account', 'accounts', 'payload']),
          accountId,
        );

        if (accountEntry) {
          if (!API.isExpensesFetched(accountEntry[1].get('expenses'))) {
            return dispatch({
              type: actionTypes.ACCOUNT_DETAIL_FETCH,
              payload: API.fetchExpensesOfAccount(accountEntry[1]),
              meta: {
                index: accountEntry[0],
              },
            });
          }

          return dispatch({
            type: actionTypes.ACCOUNT_DETAIL_FETCH,
          });
        }

        return dispatch({
          type: actionTypes.ACCOUNT_DETAIL_FETCH,
          error: true,
        });
      });
    };
  },
  tapDeleteConfirm(accountId) {
    return (dispatch, getState) => {
      const state = getState();
      const accountEntry = accountUtils.findEntry(
        state.getIn(['account', 'accounts', 'payload']),
        accountId,
      );

      dispatch({
        type: actionTypes.ACCOUNT_DETAIL_DELETE_CONFIRM,
        payload: {
          accountIndex: accountEntry[0],
        },
      });

      API.removeAccount(accountEntry[1]);
    };
  },
  unmount() {
    return {
      type: actionTypes.ACCOUNT_DETAIL_UNMOUNT,
    };
  },
};

export default accountDetailActions;
