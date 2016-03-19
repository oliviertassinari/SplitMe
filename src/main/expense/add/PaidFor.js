import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';

import polyglot from 'polyglot';
import MemberAdd from 'main/member/Add';
import ExpensePaidForMember from 'main/expense/add/PaidForMember';

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
          const id = member.get('id');
          const paidForMember = paidFor.findEntry((item) => {
            return item.get('contactId') === id;
          });

          return (
            <ExpensePaidForMember
              key={id} member={member} split={split}
              currency={currency} onChange={onChange}
              paidForMember={paidForMember[1]}
              paidForMemberIndex={paidForMember[0]}
            />
          );
        })}
        <MemberAdd onAddMember={onAddMember} />
      </div>
    );
  }
}

export default pure(ExpensePaidFor);
