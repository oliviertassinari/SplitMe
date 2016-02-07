import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';

import polyglot from 'polyglot';
import MemberAdd from 'Main/MemberAdd';
import ExpensePaidForMember from 'Main/Expense/PaidForMember';

class ExpensePaidFor extends React.Component {
  static propTypes = {
    currency: React.PropTypes.string.isRequired,
    members: React.PropTypes.instanceOf(Immutable.List).isRequired,
    onAddMember: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    paidFor: React.PropTypes.instanceOf(Immutable.List).isRequired,
    split: React.PropTypes.string.isRequired,
  };

  render() {
    const {
      currency,
      members,
      onAddMember,
      onChange,
      paidFor,
      split,
    } = this.props;

    return (
      <div data-test="ExpenseAddPaidFor">
        {polyglot.t('paid_for')}
        {members.map((member) => {
          return (
            <ExpensePaidForMember
              key={member.get('id')}
              member={member} split={split} currency={currency}
              onChange={onChange} paidFor={paidFor}
            />
          );
        })}
        <MemberAdd onAddMember={onAddMember} />
      </div>
    );
  }
}

export default pure(ExpensePaidFor);
