'use strict';

var React = require('react/addons');
var _ = require('underscore');
var Checkbox = require('material-ui/lib/checkbox');
var IconAdd = require('material-ui/lib/svg-icons/content/add');

var utils = require('utils');
var contacts = require('contacts');
var polyglot = require('polyglot');
var locale = require('locale');
var List = require('Main/List');
var MembersAvatar = require('Main/MembersAvatar');
var AmountField = require('Main/AmountField');
var action = require('./action');

var styles = {
  unequaly: {
    width: 60,
  },
  shares: {
    width: 40,
  },
};

var PaidFor = React.createClass({
  propTypes: {
    members: React.PropTypes.array.isRequired,
    paidFor: React.PropTypes.array.isRequired,
    split: React.PropTypes.string.isRequired,
    currency: React.PropTypes.string.isRequired,
  },
  onTouchTapAdd: function() {
    contacts.pickContact().then(action.pickContact);
  },
  getPaidForById: function(id) {
    return _.findWhere(this.props.paidFor, { contactId: id });
  },
  onTouchTapEqualy: function(ref, event) {
    var input = this.refs[ref].getDOMNode().querySelector('input');

    if(input !== event.target) {
      input.click();
    }
  },
  onCheckEqualy: function(id, event, checked) {
    var paidForItem = this.getPaidForById(id);
    paidForItem.split_equaly = checked;

    action.changePaidFor(this.props.paidFor);
  },
  onChangeUnEqualy: function(id, amount) {
    var paidForItem = this.getPaidForById(id);
    paidForItem.split_unequaly = amount;
    action.changePaidFor(this.props.paidFor);
  },
  onChangeShares: function(id, amount) {
    var paidForItem = this.getPaidForById(id);
    paidForItem.split_shares = amount;
    action.changePaidFor(this.props.paidFor);
  },
  render: function() {
    var self = this;
    var currency = locale.currencyToString(self.props.currency);

    var paidForList = _.map(this.props.members, function (member) {
      var right;
      var onTouchTap;

      var paidFor = self.getPaidForById(member.id);

      switch(self.props.split) {
        case 'equaly':
          right = <Checkbox label="" name="paidFor" ref={member.id + '_checkbox'} value={member.id}
                    defaultChecked={paidFor.split_equaly} onCheck={self.onCheckEqualy.bind(self, member.id)} />;
          onTouchTap = self.onTouchTapEqualy.bind(self, member.id + '_checkbox');
          break;

        case 'unequaly':
          right = <div>
              <AmountField defaultValue={paidFor.split_unequaly} style={styles.unequaly}
                onChange={self.onChangeUnEqualy.bind(self, member.id)} />
              {currency}
            </div>;
          break;

        case 'shares':
          right = <div>
              <AmountField defaultValue={paidFor.split_shares} style={styles.shares} isInteger={true}
                onChange={self.onChangeShares.bind(self, member.id)} />
              {polyglot.t('shares')}
            </div>;
          break;
      }

      var avatar = <MembersAvatar member={member} />;

      return <List onTouchTap={onTouchTap} right={right} left={avatar} key={member.id} withoutMargin={true}>
          {utils.getDisplayNameMember(member)}
      </List>;
    });

    return <div className="testExpenseAddPaidFor">
      {polyglot.t('paid_for')}
      {paidForList}
      <List left={<IconAdd />} onTouchTap={this.onTouchTapAdd} withoutMargin={true}>
        {polyglot.t('add_a_new_person')}
      </List>
    </div>;
  },
});

module.exports = PaidFor;
