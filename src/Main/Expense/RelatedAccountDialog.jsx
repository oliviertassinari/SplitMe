'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Immutable = require('immutable');
const Dialog = require('material-ui/src/dialog');
const RadioButton = require('material-ui/src/radio-button');
// const IconAdd = require('material-ui/src/svg-icons/content/add');

const polyglot = require('polyglot');
const accountUtils = require('Main/Account/utils');
const List = require('Main/List');
const MembersAvatar = require('Main/MembersAvatar');

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
    onDismiss: React.PropTypes.func,
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
    const self = this;
    const props = self.props;

    return (
      <Dialog title={polyglot.t('expense_related_account')} ref="dialog"
        contentClassName="testExpenseAddRelatedAccountDialog"
        onDismiss={props.onDismiss} bodyStyle={styles.body}>
        <div style={styles.list}>
          {props.accounts.map((account) => {
            const avatar = <MembersAvatar members={account.get('members')} />;
            const radioButton = (
              <RadioButton value={account.get('_id')}
                checked={account.get('_id') === self.state.selected} />
            );

            return (
              <List onTouchTap={self.onTouchTap.bind(self, account)}
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

module.exports = RelatedAccountDialog;
