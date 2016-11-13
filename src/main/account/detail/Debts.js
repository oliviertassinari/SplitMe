// @flow weak

import React, { PropTypes } from 'react';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Paper from 'material-ui-build-next/src/Paper';
import { ListSubheader } from 'material-ui-build-next/src/List';
import polyglot from 'polyglot';
import ScrollView from 'modules/components/ScrollView';
import LayoutBody from 'modules/components/LayoutBody';
import accountUtils from 'main/account/utils';
import expenseUtils from 'main/expense/utils';
import Transfer from 'main/account/Transfer';
import AccountDetailDebtsEmpty from './DebtsEmpty';

export const AccountDetailDebts = (props) => {
  const {
    members,
    style,
    useLayout,
  } = props;

  const list = accountUtils.getCurrenciesWithMembers(members)
    .map((currency) => {
      let max = 0;

      const transfers = accountUtils.getTransfersForSettlingMembers(members, currency)
        .filter((transfer) => {
          if (transfer.amount > max) {
            max = transfer.amount;
          }

          return expenseUtils.isSignificanAmount(transfer.amount);
        });

      return {
        currency,
        transfers,
        max,
      };
    })
    .filter((item) => item.transfers.length > 0)
    // Sort DESC by max transfers value.
    .sort((itemA, itemB) => itemB.max - itemA.max);

  if (list.length === 0) {
    return <AccountDetailDebtsEmpty />;
  }

  const Layout = useLayout ? LayoutBody : 'div';

  return (
    <ScrollView fullHeight>
      <Layout style={style} data-test="AccountDetailDebts">
        {list.map((item) => (
          <div key={item.currency}>
            {list.length > 1 && (
              <ListSubheader data-test="Subheader">
                {polyglot.t('in_currency', {
                  currency: item.currency,
                })}
              </ListSubheader>
            )}
            <Paper rounded={false}>
              {item.transfers.map((transfer, index) => (
                <Transfer key={index} transfer={transfer} />
              ))}
            </Paper>
          </div>
        ))}
      </Layout>
    </ScrollView>
  );
};

AccountDetailDebts.propTypes = {
  members: ImmutablePropTypes.list.isRequired,
  style: PropTypes.object,
  useLayout: PropTypes.bool,
};

AccountDetailDebts.defaultProps = {
  useLayout: true,
};

export default pure(AccountDetailDebts);
