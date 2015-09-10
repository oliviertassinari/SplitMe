'use strict';

const React = require('react/addons');
const Immutable = require('immutable');
const Dialog = require('material-ui/lib/dialog');
const RadioButton = require('material-ui/lib/radio-button');
const IconAdd = require('material-ui/lib/svg-icons/content/add');
const ListItem = require('material-ui/lib/lists/list-item');

const polyglot = require('polyglot');
const accountUtils = require('Main/Account/utils');
const List = require('Main/List');
const MemberAvatar = require('Main/MemberAvatar');

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
    React.addons.PureRenderMixin,
  ],
  getInitialState: function() {
    return {
      selected: this.props.selected || '',
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.hasOwnProperty('selected')) {
      this.setState({
        selected: nextProps.selected,
      });
    }
  },
  show: function() {
    this.refs.dialog.show();
  },
  dismiss: function() {
    this.refs.dialog.dismiss();
  },
  onTouchTap: function(newSelectedMember) {
    this.setState({
      selected: newSelectedMember.get('id'),
    });

    this.props.onChange(newSelectedMember);
  },
  render: function() {
    const self = this;
    const {
      members,
      onDismiss,
      onPickContact,
    } = this.props;

    return <Dialog title={polyglot.t('paid_by')} ref="dialog" contentClassName="testExpenseAddPaidByDialog"
      onDismiss={onDismiss} bodyStyle={styles.body}>
        <div style={styles.list}>
          {members.map(function(member) {
            const avatar = <MemberAvatar member={member} />;
            const radioButton = <RadioButton value={member.get('id')}
              checked={member.get('id') === self.state.selected} />;

            return <List onTouchTap={self.onTouchTap.bind(self, member)}
              left={avatar} key={member.get('id')} right={radioButton}>
                  {accountUtils.getNameMember(member)}
              </List>;
          })}
        </div>
        <ListItem leftIcon={<IconAdd className="testExpenseAddPaidByDialogIcon" />} className="testList"
          onTouchTap={onPickContact} primaryText={polyglot.t('add_a_new_person')} />
      </Dialog>;
  },
});

module.exports = PaidByDialog;
