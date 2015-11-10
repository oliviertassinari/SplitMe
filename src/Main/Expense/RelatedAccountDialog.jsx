import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import Dialog from 'material-ui/lib/dialog';
import RadioButton from 'material-ui/lib/radio-button';
// import IconAdd from 'material-ui/lib/svg-icons/content/add';

import polyglot from 'polyglot';
import accountUtils from 'Main/Account/utils';
import List from 'Main/List';
import MembersAvatar from 'Main/MembersAvatar';

const styles = {
  body: {
    padding: '16px 0 5px 0',
  },
  list: {
    maxHeight: 350,
    overflow: 'auto',
  },
};

const RelatedAccountDialog = React.createClass({
  propTypes: {
    accounts: React.PropTypes.instanceOf(Immutable.List).isRequired,
    onChange: React.PropTypes.func,
    selected: React.PropTypes.string,
  },
  mixins: [
    PureRenderMixin,
  ],
  getInitialState() {
    return {
      selected: this.props.selected || '',
    };
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty('selected')) {
      this.setState({
        selected: nextProps.selected,
      });
    }
  },
  show() {
    this.refs.dialog.show();
  },
  dismiss() {
    this.refs.dialog.dismiss();
  },
  onTouchTap(newSelectedAccount) {
    this.setState({
      selected: newSelectedAccount.get('_id'),
    });

    this.props.onChange(newSelectedAccount);
  },
  onTouchTapAdd() {
  },
  render() {
    const {
      accounts,
      ...other,
    } = this.props;

    return (
      <Dialog {...other} title={polyglot.t('expense_related_account')}
        contentClassName="testExpenseAddRelatedAccountDialog" bodyStyle={styles.body}>
        <div style={styles.list}>
          {accounts.map((account) => {
            const avatar = <MembersAvatar members={account.get('members')} />;
            const radioButton = (
              <RadioButton value={account.get('_id')}
                checked={account.get('_id') === this.state.selected} />
            );

            return (
              <List onTouchTap={this.onTouchTap.bind(this, account)}
                left={avatar} key={account.get('_id')} right={radioButton}>
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
  },
});

export default RelatedAccountDialog;
