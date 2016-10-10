// @flow weak

import React, { PropTypes, Component } from 'react';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { createStyleSheet } from 'stylishly/lib/styleSheet';
import Dialog from 'material-ui-build/src/Dialog';
import RadioButton from 'material-ui-build/src/RadioButton/RadioButton';
import { black } from 'material-ui-build/src/styles/colors';
// import IconAdd from 'material-ui-build/src/svg-icons/content/add';
import polyglot from 'polyglot';
import accountUtils from 'main/account/utils';
import List from 'modules/components/List';
import MemberAvatars from 'main/member/Avatars';

const styleSheet = createStyleSheet('RelatedAccountDialog', () => ({
  list: {
    maxHeight: 350,
    overflow: 'auto',
  },
}));

const styles = {
  body: {
    padding: '0 0 5px',
    color: black,
  },
};

class RelatedAccountDialog extends Component {
  static propTypes = {
    accounts: ImmutablePropTypes.list.isRequired,
    onChange: PropTypes.func,
    selected: PropTypes.string,
  };

  static contextTypes = {
    styleManager: PropTypes.object.isRequired,
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

  handleTouchTap = (newSelectedAccount) => {
    this.setState({
      selected: newSelectedAccount.get('_id'),
    });

    this.props.onChange(newSelectedAccount);
  };

  // onTouchTapAdd() {
  // }

  render() {
    const classes = this.context.styleManager.render(styleSheet);

    const {
      accounts,
      ...other,
    } = this.props;

    return (
      <Dialog
        {...other}
        title={polyglot.t('expense_related_account')}
        contentClassName="testExpenseAddRelatedAccountDialog"
        bodyStyle={styles.body}
      >
        <div className={classes.list}>
          {accounts.map((account) => {
            const avatar = <MemberAvatars members={account.get('members')} />;
            const radioButton = (
              <RadioButton
                value={account.get('_id')}
                checked={account.get('_id') === this.state.selected}
              />
            );

            return (
              <List
                onTouchTap={this.handleTouchTap.bind(this, account)}
                left={avatar}
                key={account.get('_id')}
                right={radioButton}
              >
                {accountUtils.getNameAccount(account)}
              </List>
            );
          })}
        </div>
        {/* <List left={<IconAdd />} onTouchTap={this.onTouchTapAdd}>
          {polyglot.t('add_a_new_account')}
        </List> */}
      </Dialog>
    );
  }
}

export default pure(RelatedAccountDialog);
