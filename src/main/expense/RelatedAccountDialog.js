import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import Dialog from 'material-ui/src/dialog';
import RadioButton from 'material-ui/src/radio-button';
// import IconAdd from 'material-ui/src/svg-icons/content/add';

import polyglot from 'polyglot';
import accountUtils from 'main/account/utils';
import List from 'main/List';
import MemberAvatars from 'main/member/Avatars';

const styles = {
  body: {
    padding: '16px 0 5px 0',
  },
  list: {
    maxHeight: 350,
    overflow: 'auto',
  },
};

class RelatedAccountDialog extends React.Component {
  static propTypes = {
    accounts: React.PropTypes.instanceOf(Immutable.List).isRequired,
    onChange: React.PropTypes.func,
    selected: React.PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: props.selected || '',
    };
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
        <div style={styles.list}>
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
        {/*<List left={<IconAdd />} onTouchTap={this.onTouchTapAdd}>
          {polyglot.t('add_a_new_account')}
        </List> */}
      </Dialog>
    );
  }
}

export default pure(RelatedAccountDialog);
