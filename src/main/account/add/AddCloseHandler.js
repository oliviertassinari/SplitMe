import { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { connect } from 'react-redux';
import accountAddActions from 'main/account/add/actions';

class AccountAddCloseHandler extends Component {
  static propTypes = {
    accountId: PropTypes.string,
    closing: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidUpdate() {
    if (this.props.closing) {
      this.props.dispatch(accountAddActions.close(this.props.accountId));
    }
  }

  render() {
    return null;
  }
}

export default compose(
  pure,
  connect(state => {
    return {
      closing: state.getIn(['accountAdd', 'closing']),
    };
  }),
)(AccountAddCloseHandler);
