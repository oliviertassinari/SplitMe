'use strict';

var React = require('react/addons');
var Immutable = require('immutable');
var Checkbox = require('material-ui/lib/checkbox');
var IconAdd = require('material-ui/lib/svg-icons/content/add');

var utils = require('utils');
var polyglot = require('polyglot');
var locale = require('locale');
var List = require('Main/List');
var MemberAvatar = require('Main/MemberAvatar');
var AmountField = require('Main/AmountField');

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
    currency: React.PropTypes.string.isRequired,
    members: React.PropTypes.instanceOf(Immutable.List).isRequired,
    onChange: React.PropTypes.func.isRequired,
    onPickContact: React.PropTypes.func.isRequired,
    paidFor: React.PropTypes.instanceOf(Immutable.List).isRequired,
    split: React.PropTypes.string.isRequired,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  onTouchTapAdd: function() {
    this.props.onPickContact();
  },
  getPaidForById: function(id) {
    return this.props.paidFor.findEntry(function(item) {
        return item.get('contactId') === id;
      });
  },
  onTouchTapEqualy: function(ref, event) {
    var input = this.refs[ref].getDOMNode().querySelector('input');

    if (input !== event.target) {
      input.click();
    }
  },
  onCheckEqualy: function(id, event, checked) {
    var paidForIndex = this.getPaidForById(id)[0];
    var paidFor = this.props.paidFor.setIn([paidForIndex, 'split_equaly'], checked);

    this.props.onChange(paidFor);
  },
  onChangeUnEqualy: function(id, amount) {
    var paidForIndex = this.getPaidForById(id)[0];
    var paidFor = this.props.paidFor.setIn([paidForIndex, 'split_unequaly'], amount);

    this.props.onChange(paidFor);
  },
  onChangeShares: function(id, amount) {
    var paidForIndex = this.getPaidForById(id)[0];
    var paidFor = this.props.paidFor.setIn([paidForIndex, 'split_shares'], amount);

    this.props.onChange(paidFor);
  },
  render: function() {
    var self = this;

    var paidForList = this.props.members.map(function(member) {
      var right;
      var onTouchTap;

      var paidFor = self.getPaidForById(member.get('id'))[1];

      switch (self.props.split) {
        case 'equaly':
          right = <Checkbox label="" name="paidFor" ref={member.get('id') + '_checkbox'} value={member.get('id')}
            defaultChecked={paidFor.get('split_equaly')}
            onCheck={self.onCheckEqualy.bind(self, member.get('id'))} />;
          onTouchTap = self.onTouchTapEqualy.bind(self, member.get('id') + '_checkbox');
          break;

        case 'unequaly':
          var currency = locale.currencyToString(self.props.currency);
          right = <div>
              <AmountField defaultValue={paidFor.get('split_unequaly')} style={styles.unequaly}
                onChange={self.onChangeUnEqualy.bind(self, member.get('id'))} />
              {currency}
            </div>;
          break;

        case 'shares':
          right = <div>
              <AmountField defaultValue={paidFor.get('split_shares')} style={styles.shares} isInteger={true}
                onChange={self.onChangeShares.bind(self, member.get('id'))} />
              {polyglot.t('shares')}
            </div>;
          break;
      }

      var avatar = <MemberAvatar member={member} />;

      return <List onTouchTap={onTouchTap} right={right} left={avatar} key={member.get('id')}
        withoutMargin={true}>
          {utils.getNameMember(member)}
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
