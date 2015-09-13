'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const Immutable = require('immutable');
const Checkbox = require('material-ui/lib/checkbox');
const IconAdd = require('material-ui/lib/svg-icons/content/add');
const ListItem = require('material-ui/lib/lists/list-item');

const accountUtils = require('Main/Account/utils');
const polyglot = require('polyglot');
const locale = require('locale');
const List = require('Main/List');
const MemberAvatar = require('Main/MemberAvatar');
const AmountField = require('Main/AmountField');

const styles = {
  unequaly: {
    width: 60,
  },
  shares: {
    width: 40,
  },
};

const PaidFor = React.createClass({
  propTypes: {
    currency: React.PropTypes.string.isRequired,
    members: React.PropTypes.instanceOf(Immutable.List).isRequired,
    onChange: React.PropTypes.func.isRequired,
    onPickContact: React.PropTypes.func.isRequired,
    paidFor: React.PropTypes.instanceOf(Immutable.List).isRequired,
    split: React.PropTypes.string.isRequired,
  },
  mixins: [
    PureRenderMixin,
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
    const input = this.refs[ref].getDOMNode().querySelector('input');

    if (input !== event.target) {
      input.click();
    }
  },
  onCheckEqualy: function(id, event, checked) {
    const paidForIndex = this.getPaidForById(id)[0];
    const paidFor = this.props.paidFor.setIn([paidForIndex, 'split_equaly'], checked);

    this.props.onChange(paidFor);
  },
  onChangeUnEqualy: function(id, amount) {
    const paidForIndex = this.getPaidForById(id)[0];
    const paidFor = this.props.paidFor.setIn([paidForIndex, 'split_unequaly'], amount);

    this.props.onChange(paidFor);
  },
  onChangeShares: function(id, amount) {
    const paidForIndex = this.getPaidForById(id)[0];
    const paidFor = this.props.paidFor.setIn([paidForIndex, 'split_shares'], amount);

    this.props.onChange(paidFor);
  },
  render: function() {
    const self = this;

    return <div className="testExpenseAddPaidFor">
        {polyglot.t('paid_for')}
        {this.props.members.map(function(member) {
          let right;
          let onTouchTap;

          const paidFor = self.getPaidForById(member.get('id'))[1];

          switch (self.props.split) {
            case 'equaly':
              right = <Checkbox label="" name="paidFor" ref={member.get('id') + '_checkbox'} value={member.get('id')}
                defaultChecked={paidFor.get('split_equaly')}
                onCheck={self.onCheckEqualy.bind(self, member.get('id'))} />;
              onTouchTap = self.onTouchTapEqualy.bind(self, member.get('id') + '_checkbox');
              break;

            case 'unequaly':
              const currency = locale.currencyToString(self.props.currency);
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

          const avatar = <MemberAvatar member={member} />;

          return <List onTouchTap={onTouchTap} right={right} left={avatar} key={member.get('id')}
            withoutMargin={true}>
              {accountUtils.getNameMember(member)}
          </List>;
        })}
        <ListItem leftIcon={<IconAdd />} onTouchTap={this.onTouchTapAdd} withoutMargin={true}
          primaryText={polyglot.t('add_a_new_person')} className="testListItem" />
      </div>;
  },
});

module.exports = PaidFor;
