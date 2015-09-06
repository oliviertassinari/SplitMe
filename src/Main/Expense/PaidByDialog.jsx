'use strict';

var React = require('react/addons');
var Immutable = require('immutable');
var Dialog = require('material-ui/lib/dialog');
var RadioButton = require('material-ui/lib/radio-button');
var IconAdd = require('material-ui/lib/svg-icons/content/add');
var ListItem = require('material-ui/lib/lists/list-item');

var polyglot = require('polyglot');
var utils = require('utils');
var List = require('Main/List');
var MemberAvatar = require('Main/MemberAvatar');

var styles = {
  body: {
    padding: '16px 0 5px 0',
  },
  list: {
    maxHeight: 350,
    overflow: 'auto',
  },
};

var PaidByDialog = React.createClass({
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
    var self = this;

    return <Dialog title={polyglot.t('paid_by')} ref="dialog" contentClassName="testExpenseAddPaidByDialog"
      onDismiss={this.props.onDismiss} bodyStyle={styles.body}>
        <div style={styles.list}>
          {this.props.members.map(function(member) {
            var avatar = <MemberAvatar member={member} />;
            var radioButton = <RadioButton value={member.get('id')}
              checked={member.get('id') === self.state.selected} />;

            return <List onTouchTap={self.onTouchTap.bind(self, member)}
              left={avatar} key={member.get('id')} right={radioButton}>
                  {utils.getNameMember(member)}
              </List>;
          })}
        </div>
        <ListItem leftIcon={<IconAdd className="testExpenseAddPaidByDialogIcon" />} className="testList"
          onTouchTap={this.props.onPickContact} primaryText={polyglot.t('add_a_new_person')} />
      </Dialog>;
  },
});

module.exports = PaidByDialog;
