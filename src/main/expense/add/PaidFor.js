// @flow weak

import React, { PropTypes } from 'react';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import polyglot from 'polyglot';
import MemberAdd from 'main/member/Add';
import ExpensePaidForMember from 'main/expense/add/PaidForMember';

const ExpensePaidFor = (props) => {
  const {
    currency,
    members,
    onAddMember,
    onChange,
    paidFor,
    split,
  } = props;

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
            key={id}
            member={member}
            split={split}
            currency={currency}
            onChange={onChange}
            paidForMember={paidForMember[1]}
            paidForMemberIndex={paidForMember[0]}
          />
        );
      })}
      <MemberAdd onAddMember={onAddMember} />
    </div>
  );
};

ExpensePaidFor.propTypes = {
  currency: PropTypes.string.isRequired,
  members: ImmutablePropTypes.list.isRequired,
  onAddMember: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  paidFor: ImmutablePropTypes.list.isRequired,
  split: PropTypes.string.isRequired,
};

export default pure(ExpensePaidFor);
