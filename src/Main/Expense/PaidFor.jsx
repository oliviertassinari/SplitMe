import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import Checkbox from 'material-ui/lib/checkbox';
import IconAdd from 'material-ui/lib/svg-icons/content/add';
import ListItem from 'material-ui/lib/lists/list-item';

import accountUtils from 'Main/Account/utils';
import polyglot from 'polyglot';
import locale from 'locale';
import List from 'Main/List';
import MemberAvatar from 'Main/MemberAvatar';
import AmountField from 'Main/AmountField';

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
  handleTouchTapAdd() {
    this.props.onPickContact();
  },
  getPaidForById(id) {
    return this.props.paidFor.findEntry((item) => {
      return item.get('contactId') === id;
    });
  },
  onTouchTapEqualy(ref, event) {
    const input = ReactDOM.findDOMNode(this.refs[ref]).querySelector('input');

    if (input !== event.target) {
      input.click();
    }
  },
  onCheckEqualy(id, event, checked) {
    const paidForIndex = this.getPaidForById(id)[0];
    const paidFor = this.props.paidFor.setIn([paidForIndex, 'split_equaly'], checked);

    this.props.onChange(paidFor);
  },
  onChangeUnEqualy(id, amount) {
    const paidForIndex = this.getPaidForById(id)[0];
    const paidFor = this.props.paidFor.setIn([paidForIndex, 'split_unequaly'], amount);

    this.props.onChange(paidFor);
  },
  onChangeShares(id, amount) {
    const paidForIndex = this.getPaidForById(id)[0];
    const paidFor = this.props.paidFor.setIn([paidForIndex, 'split_shares'], amount);

    this.props.onChange(paidFor);
  },
  render() {
    const self = this;

    return (
      <div data-test="ExpenseAddPaidFor">
        {polyglot.t('paid_for')}
        {this.props.members.map((member) => {
          let right;
          let onTouchTap;

          const paidFor = self.getPaidForById(member.get('id'))[1];

          switch (self.props.split) {
            case 'equaly':
              right = (
                <Checkbox label="" name="paidFor" ref={member.get('id') + '_checkbox'} value={member.get('id')}
                  defaultChecked={paidFor.get('split_equaly')}
                  onCheck={self.onCheckEqualy.bind(self, member.get('id'))} />
              );
              onTouchTap = self.onTouchTapEqualy.bind(self, member.get('id') + '_checkbox');
              break;

            case 'unequaly':
              const currency = locale.currencyToString(self.props.currency);
              right = (
                <div>
                  <AmountField value={paidFor.get('split_unequaly')} style={styles.unequaly}
                    onChange={self.onChangeUnEqualy.bind(self, member.get('id'))} />
                  {currency}
                </div>
              );
              break;

            case 'shares':
              right = (
                <div>
                  <AmountField value={paidFor.get('split_shares')} style={styles.shares} isInteger={true}
                    onChange={self.onChangeShares.bind(self, member.get('id'))} />
                  {polyglot.t('shares')}
                </div>
              );
              break;
          }

          const avatar = <MemberAvatar member={member} />;

          return (
            <List onTouchTap={onTouchTap} right={right} left={avatar} key={member.get('id')}
              withoutMargin={true}>
              {accountUtils.getNameMember(member)}
            </List>
          );
        })}
        <ListItem leftIcon={<IconAdd />} onTouchTap={this.handleTouchTapAdd} withoutMargin={true}
          primaryText={polyglot.t('add_a_new_person')} data-test="ListItem" />
      </div>
    );
  },
});

export default PaidFor;
