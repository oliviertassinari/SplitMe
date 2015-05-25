'use strict';

var React = require('react/addons');
var _ = require('underscore');
var Checkbox = require('material-ui/lib/checkbox');
var FontIcon = require('material-ui/lib/font-icon');

var utils = require('../../utils');
var polyglot = require('../../polyglot');
var locale = require('../../locale');
var List = require('../List');
var Avatar = require('../Avatar');
var AmountField = require('../AmountField');
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
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    members: React.PropTypes.array.isRequired,
    paidFor: React.PropTypes.array.isRequired,
    split: React.PropTypes.string.isRequired,
    currency: React.PropTypes.string.isRequired,
    style: React.PropTypes.object,
  },
  onTouchTapAdd: function() {
    if ('production' === process.env.NODE_ENV) {
      navigator.contacts.pickContact(function(contact) {
        console.log(contact);
        action.pickContact(contact);
      }, function(error) {
        console.log(error);
      });
    } else {
      action.pickContact({
        id: '101',
        displayName: 'My name',
      });
    }
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

      var avatar = <Avatar contact={member} />;

      return <List onTouchTap={onTouchTap} right={right} left={avatar} key={member.id} withoutMargin={true}>
          {utils.getDisplayName(member)}
      </List>;
    });

    var icon = <FontIcon className="md-add" />;

    return <div style={this.props.style} className="testExpenseAddPaidFor">
      {polyglot.t('paid_for')}
      {paidForList}
      <List left={icon} onTouchTap={this.onTouchTapAdd} withoutMargin={true}>
        {polyglot.t('add_a_new_person')}
      </List>
    </div>;
  },
});

module.exports = PaidFor;
