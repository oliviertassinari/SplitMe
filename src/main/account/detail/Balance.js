import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { withStyles } from 'material-ui-next/styles';
import Paper from 'material-ui-next/Paper';
import grey from 'material-ui-next/colors/grey';
import { ListSubheader } from 'material-ui-next/List';
import polyglot from 'polyglot';
import LayoutBody from 'modules/components/LayoutBody';
import ScrollView from 'modules/components/ScrollView';
import accountUtils from 'main/account/utils';
import AccountDetailBalanceChart from 'main/account/detail/BalanceChart';

const styles = {
  paperInner: {
    position: 'relative',
  },
  origin: {
    height: '100%',
    position: 'absolute',
    left: '75%',
    borderLeft: `1px dashed ${grey[500]}`,
  },
};

export const AccountDetailBalance = props => {
  const { classes, members: membersProp, style, useLayout } = props;

  const list = accountUtils
    .getCurrenciesWithMembers(membersProp)
    .map(currency => {
      let max = 0;

      // Sort DESC by balance value
      const members = membersProp.sortBy(member => {
        const balance = accountUtils.getMemberBalance(member, currency);

        if (balance) {
          // If we add new members and a new currency, the balance is not set
          // Compute the max value
          const value = Math.abs(balance.get('value'));

          if (value > max + 0) {
            max = value;
          }

          return balance.get('value');
        }

        return 0;
      }, (valueA, valueB) => valueB - valueA);

      return {
        currency,
        members,
        max,
      };
    })
    // Sort DESC by max transfers value.
    .sort((itemA, itemB) => itemB.max - itemA.max);

  const Layout = useLayout ? LayoutBody : 'div';

  return (
    <ScrollView fullHeight>
      <Layout style={style} data-test="AccountDetailBalance">
        {list.map(item => {
          return (
            <div key={item.currency}>
              {list.length > 1 && (
                <ListSubheader data-test="Subheader">
                  {polyglot.t('in_currency', {
                    currency: item.currency,
                  })}
                </ListSubheader>
              )}
              <Paper square>
                <div className={classes.paperInner}>
                  <div className={classes.origin} />
                  {item.members
                    .map(member => (
                      <AccountDetailBalanceChart
                        key={member.get('id')}
                        member={member}
                        currency={item.currency}
                        max={item.max}
                      />
                    ))
                    .toArray()}
                </div>
              </Paper>
            </div>
          );
        })}
      </Layout>
    </ScrollView>
  );
};

AccountDetailBalance.propTypes = {
  classes: PropTypes.object.isRequired,
  members: ImmutablePropTypes.list.isRequired,
  style: PropTypes.object,
  useLayout: PropTypes.bool,
};

AccountDetailBalance.defaultProps = {
  useLayout: true,
};

export default compose(pure, withStyles(styles))(AccountDetailBalance);
