
import { PropTypes, Component } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { connect } from 'react-redux';
import routerActions from 'main/routerActions';
import expenseActions from 'main/expense/add/actions';

class ExpenseAddDeleteHandler extends Component {
  static propTypes = {
    accountId: PropTypes.string,
    closing: PropTypes.bool.isRequired,
    deleting: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidUpdate() {
    const {
      accountId,
      closing,
      deleting,
      dispatch,
    } = this.props;

    if (deleting) {
      dispatch(expenseActions.tapDeleteConfirm(accountId));
      dispatch(routerActions.goBack(`/account/${accountId}/expenses`));
    } else if (closing) {
      dispatch(expenseActions.close(accountId));
    }
  }

  render() {
    return null;
  }
}

export default compose(
  pure,
  connect((state) => {
    return {
      closing: state.getIn(['expenseAdd', 'closing']),
      deleting: state.getIn(['expenseAdd', 'deleting']),
    };
  }),
)(ExpenseAddDeleteHandler);
