import {PropTypes, Component} from 'react';
import pure from 'recompose/pure';
import {connect} from 'react-redux';

import routerActions from 'main/routerActions';
import accountDetailActions from 'main/account/detail/actions';

class AccountDetailDeleteHandler extends Component {
  static propTypes = {
    accountId: PropTypes.string.isRequired,
    deleting: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidUpdate() {
    if (this.props.deleting) {
      const {
        accountId,
        dispatch,
      } = this.props;

      dispatch(routerActions.goBack('/accounts'));
      dispatch(accountDetailActions.tapDeleteConfirm(accountId));
    }
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return {
    deleting: state.getIn(['accountDetail', 'deleting']),
  };
}

export default pure(connect(mapStateToProps)(AccountDetailDeleteHandler));
