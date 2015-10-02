'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const colors = require('material-ui/src/styles/colors');
const Immutable = require('immutable');

const locale = require('locale');
const List = require('Main/List');
const MemberAvatar = require('Main/MemberAvatar');
const accountUtils = require('Main/Account/utils');

const styles = {
  root: {
    width: '100%',
    display: 'flex',
  },
  left: {
    width: '50%',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    width: '50%',
    flexShrink: 0,
  },
  rectInner: {
    padding: '0 10px',
    whiteSpace: 'nowrap',
  },
};

const AccountBalanceChart = React.createClass({
  propTypes: {
    currency: React.PropTypes.string.isRequired,
    max: React.PropTypes.number.isRequired,
    member: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  },
  mixins: [
    PureRenderMixin,
  ],
  render: function() {
    const {
      currency,
      max,
      member,
    } = this.props;

    const balance = accountUtils.getMemberBalance(member, currency);

    if (!balance) { // If we add new members and a new currency, the balance is not set
      return null;
    }

    let amountValue;
    const value = balance.get('value');

    const styleRect = {
      height: 22,
      position: 'relative',
      paddingTop: 4,
    };

    if (Math.round(value * 100) === 0) {
      amountValue = 0;
      styleRect.width = '2%';
      styleRect.background = colors.grey400;
      styleRect.left = '50%';
    } else {
      amountValue = value;
      let width = (Math.abs(value) / max) * 50;
      if (width < 2) {
        width = 2;
      }

      styleRect.width = width + '%';

      if (value > 0) {
        styleRect.background = colors.green300;
        styleRect.left = '50%';
      } else {
        styleRect.background = colors.red300;
        styleRect.left = (50 - width) + '%';
      }
    }

    const avatar = <MemberAvatar member={member} />;
    const amount = locale.numberFormat(locale.current, {
      style: 'currency',
      currency: currency,
    }).format(amountValue);

    return <div style={styles.root}>
          <List left={avatar} style={styles.left}>
            {accountUtils.getNameMember(member)}
          </List>
          <div style={styles.right}>
            <div style={styleRect} className="testAccountBalanceChart">
              <span style={styles.rectInner}>
                {amount}
              </span>
            </div>
          </div>
      </div>;
  },
});

module.exports = AccountBalanceChart;
