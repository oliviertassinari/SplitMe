import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import Dialog from 'material-ui/lib/dialog';
import RadioButton from 'material-ui/lib/radio-button';
import IconAdd from 'material-ui/lib/svg-icons/content/add';
import ListItem from 'material-ui/lib/lists/list-item';

import polyglot from 'polyglot';
import accountUtils from 'Main/Account/utils';
import List from 'Main/List';
import MemberAvatar from 'Main/MemberAvatar';

const styles = {
  body: {
    padding: '16px 0 5px 0',
  },
  list: {
    maxHeight: 350,
    overflow: 'auto',
  },
};

const PaidByDialog = React.createClass({
  propTypes: {
    members: React.PropTypes.instanceOf(Immutable.List).isRequired,
    onChange: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
    onPickContact: React.PropTypes.func,
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
  onTouchTap(newSelectedMember) {
    this.setState({
      selected: newSelectedMember.get('id'),
    });

    this.props.onChange(newSelectedMember);
  },
  render() {
    const self = this;
    const {
      members,
      onDismiss,
      onPickContact,
    } = this.props;

    return (
      <Dialog title={polyglot.t('paid_by')} ref="dialog" contentClassName="testExpenseAddPaidByDialog"
        onDismiss={onDismiss} bodyStyle={styles.body}>
        <div style={styles.list}>
          {members.map((member) => {
            const avatar = <MemberAvatar member={member} />;
            const radioButton = (
              <RadioButton value={member.get('id')}
                checked={member.get('id') === self.state.selected} />
            );

            return (
              <List onTouchTap={self.onTouchTap.bind(self, member)}
                left={avatar} key={member.get('id')} right={radioButton}>
                  {accountUtils.getNameMember(member)}
              </List>
            );
          })}
        </div>
        <ListItem leftIcon={<IconAdd data-test="ExpenseAddPaidByDialogIcon" />} data-test="ListItem"
          onTouchTap={onPickContact} primaryText={polyglot.t('add_a_new_person')} />
      </Dialog>
    );
  },
});

export default PaidByDialog;
