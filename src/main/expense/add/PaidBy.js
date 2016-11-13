// @flow weak

import React, { PropTypes, Component } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { createStyleSheet } from 'jss-theme-reactor';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextField from 'material-ui-build/src/TextField';
import { connect } from 'react-redux';
import polyglot from 'polyglot';
import withStyles from 'material-ui-build-next/src/styles/withStyles';
import List from 'modules/components/List';
import accountUtils from 'main/account/utils';
import screenActions from 'main/screen/actions';
import ExpensePaidByDialog from 'main/expense/add/PaidByDialog';
import MemberAvatar from 'main/member/Avatar';

const styleSheet = createStyleSheet('ExpensePaidBy', () => ({
  root: {
    width: '100%',
  },
}));

class ExpensePaidBy extends Component {
  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    onAddMember: PropTypes.func,
    onChange: PropTypes.func,
    openDialog: PropTypes.bool.isRequired,
    paidByContactId: PropTypes.string,
    textFieldStyle: PropTypes.object,
  };

  handleFocus = (event) => {
    event.target.blur();
  };

  handleTouchTap = () => {
    this.props.dispatch(screenActions.showDialog('paidBy'));
  };

  handleRequestClose = () => {
    this.props.dispatch(screenActions.dismissDialog());
  };

  render() {
    const {
      account,
      classes,
      onAddMember,
      onChange,
      paidByContactId,
      openDialog,
      textFieldStyle,
    } = this.props;

    let paidBy;

    if (paidByContactId) {
      const paidByMember = accountUtils.getMemberEntry(account, paidByContactId)[1];

      paidBy = (
        <div>
          {polyglot.t('paid_by')}
          <List
            left={<MemberAvatar member={paidByMember} />}
            onTouchTap={this.handleTouchTap}
            withoutMargin
          >
            {accountUtils.getNameMember(paidByMember)}
          </List>
        </div>
      );
    } else {
      paidBy = (
        <TextField
          hintText={polyglot.t('paid_by')}
          onTouchTap={this.handleTouchTap}
          onFocus={this.handleFocus}
          fullWidth
          style={textFieldStyle}
          data-test="ExpenseAddPaidBy"
        />
      );
    }

    return (
      <div className={classes.root}>
        {paidBy}
        <ExpensePaidByDialog
          members={account.get('members')}
          open={openDialog}
          selected={paidByContactId}
          onChange={onChange}
          onAddMember={onAddMember}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}

export default compose(
  pure,
  withStyles(styleSheet),
  connect(),
)(ExpensePaidBy);
