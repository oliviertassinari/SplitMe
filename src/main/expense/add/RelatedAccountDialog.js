import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { withStyles } from 'material-ui-next/styles';
import Dialog from 'material-ui/Dialog';
import RadioButton from 'material-ui/RadioButton/RadioButton';
import { black } from 'material-ui-next/colors/common';
import polyglot from 'polyglot';
import List from 'modules/components/List';
import accountUtils from 'main/account/utils';
import MemberAvatars from 'main/member/Avatars';

const styles = {
  list: {
    maxHeight: 350,
    overflow: 'auto',
  },
};

const inlineStyles = {
  body: {
    padding: '0 0 5px',
    color: black,
  },
};

class RelatedAccountDialog extends Component {
  static propTypes = {
    accounts: ImmutablePropTypes.list.isRequired,
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    selected: PropTypes.string,
  };

  state = {};

  componentWillMount() {
    this.setState({
      selected: this.props.selected || '',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty('selected')) {
      this.setState({
        selected: nextProps.selected,
      });
    }
  }

  handleTouchTap = newSelectedAccount => () => {
    this.setState({
      selected: newSelectedAccount.get('_id'),
    });

    this.props.onChange(newSelectedAccount);
  };

  render() {
    const { accounts, classes, ...other } = this.props;

    return (
      <Dialog
        {...other}
        title={polyglot.t('expense_related_account')}
        contentClassName="testExpenseAddRelatedAccountDialog"
        bodyStyle={inlineStyles.body}
      >
        <div className={classes.list}>
          {accounts.map(account => {
            const avatar = <MemberAvatars members={account.get('members')} />;
            const radioButton = (
              <RadioButton
                value={account.get('_id')}
                checked={account.get('_id') === this.state.selected}
              />
            );

            return (
              <List
                onTouchTap={this.handleTouchTap(account)}
                left={avatar}
                key={account.get('_id')}
                right={radioButton}
              >
                {accountUtils.getNameAccount(account)}
              </List>
            );
          })}
        </div>
      </Dialog>
    );
  }
}

export default compose(pure, withStyles(styles))(RelatedAccountDialog);
