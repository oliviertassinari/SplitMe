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
    width: '50%',
    flexShrink: 0,
    position: 'relative',
  },
  rect: {
    position: 'absolute',
    height: 22,
    paddingTop: 4,
    top: 20,
  },
  rectText: {
    top: 0,
    marginTop: 20,
    padding: '4px 0',
    position: 'relative',
    wordBreak: 'break-word',
    width: '50%',
    textAlign: 'center',
  },
  rectTextInner: {
    padding: '0 6px',
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
  render() {
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

    const styleRect = {};
    const VALUE_MAX = 100;

    if (Math.round(value * VALUE_MAX) === 0) {
      amountValue = 0;
      styleRect.width = '2%';
      styleRect.background = colors.grey400;
      styleRect.left = '50%';
    } else {
      amountValue = value;
      let width = (Math.abs(value) / max) * VALUE_MAX / 2;
      if (width < 2) {
        width = 2;
      }

      styleRect.width = width + '%';

      if (value > 0) {
        styleRect.background = colors.green300;
        styleRect.left = '50%';
      } else {
        styleRect.background = colors.red300;
        styleRect.left = (VALUE_MAX / 2 - width) + '%';
      }
    }

    const avatar = <MemberAvatar member={member} />;
    const amount = locale.numberFormat(locale.current, {
      style: 'currency',
      currency: currency,
    }).format(amountValue);

    return (
      <div style={styles.root}>
          <List left={avatar} style={styles.left}>
            {accountUtils.getNameMember(member)}
          </List>
          <div style={styles.right}>
            <div style={Object.assign(styleRect, styles.rect)} />
            <div style={Object.assign(styles.rectText, {
              left: styleRect.left,
            })} className="testAccountBalanceChart">
              <span style={styles.rectTextInner}>
                {amount}
              </span>
            </div>
          </div>
      </div>
    );
  },
});

module.exports = AccountBalanceChart;
