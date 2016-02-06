import React from 'react';
import ReactDOM from 'react-dom';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import Checkbox from 'material-ui/src/checkbox';

import polyglot from 'polyglot';
import locale from 'locale';
import List from 'Main/List';
import AmountField from 'Main/AmountField';
import MemberAvatar from 'Main/MemberAvatar';
import MemberAdd from 'Main/MemberAdd';
import accountUtils from 'Main/Account/utils';

const styles = {
  unequaly: {
    width: 60,
  },
  shares: {
    width: 40,
  },
};

class ExpensePaidFor extends React.Component {
  static propTypes = {
    currency: React.PropTypes.string.isRequired,
    members: React.PropTypes.instanceOf(Immutable.List).isRequired,
    onAddMember: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    paidFor: React.PropTypes.instanceOf(Immutable.List).isRequired,
    split: React.PropTypes.string.isRequired,
  };

  getPaidForById = (id) => {
    return this.props.paidFor.findEntry((item) => {
      return item.get('contactId') === id;
    });
  };

  handleTouchTapEqualy = (ref, event) => {
    const input = ReactDOM.findDOMNode(this.refs[ref]).querySelector('input');

    if (input !== event.target) {
      input.click();
    }
  };

  handleCheckEqualy = (id, event, checked) => {
    const paidForIndex = this.getPaidForById(id)[0];
    const paidFor = this.props.paidFor.setIn([paidForIndex, 'split_equaly'], checked);

    this.props.onChange(paidFor);
  };

  handleChangeUnEqualy = (id, amount) => {
    const paidForIndex = this.getPaidForById(id)[0];
    const paidFor = this.props.paidFor.setIn([paidForIndex, 'split_unequaly'], amount);

    this.props.onChange(paidFor);
  };

  handleChangeShares = (id, amount) => {
    const paidForIndex = this.getPaidForById(id)[0];
    const paidFor = this.props.paidFor.setIn([paidForIndex, 'split_shares'], amount);

    this.props.onChange(paidFor);
  };

  render() {
    const {
      onAddMember,
      members,
      currency,
      split,
    } = this.props;

    return (
      <div data-test="ExpenseAddPaidFor">
        {polyglot.t('paid_for')}
        {members.map((member) => {
          let right;
          let onTouchTap;

          const paidFor = this.getPaidForById(member.get('id'))[1];

          switch (split) {
            case 'equaly':
              const ref = `${member.get('id')}_checkbox`;
              right = (
                <Checkbox
                  label="" name="paidFor" ref={ref}
                  value={member.get('id')}
                  defaultChecked={paidFor.get('split_equaly')}
                  onCheck={this.handleCheckEqualy.bind(this, member.get('id'))}
                />
              );
              onTouchTap = this.handleTouchTapEqualy.bind(this, ref);
              break;

            case 'unequaly':
              right = (
                <div>
                  <AmountField
                    value={paidFor.get('split_unequaly')} style={styles.unequaly}
                    onChange={this.handleChangeUnEqualy.bind(this, member.get('id'))}
                  />
                  {locale.currencyToString(currency)}
                </div>
              );
              break;

            case 'shares':
              right = (
                <div>
                  <AmountField
                    value={paidFor.get('split_shares')} style={styles.shares} isInteger={true}
                    onChange={this.handleChangeShares.bind(this, member.get('id'))}
                  />
                  {polyglot.t('shares')}
                </div>
              );
              break;
          }

          const avatar = <MemberAvatar member={member} />;

          return (
            <List
              onTouchTap={onTouchTap} right={right} left={avatar}
              key={member.get('id')}
              withoutMargin={true}
            >
              {accountUtils.getNameMember(member)}
            </List>
          );
        })}
        <MemberAdd onAddMember={onAddMember} />
      </div>
    );
  }
}

export default pure(ExpensePaidFor);
