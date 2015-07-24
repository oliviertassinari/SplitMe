'use strict';

var React = require('react');
var _ = require('underscore');
var colors = require('material-ui/lib/styles/colors');

var locale = require('locale');
var List = require('Main/List');
var MemberAvatar = require('Main/MemberAvatar');
var utils = require('utils');

var styles = {
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

var AccountBalanceChart = React.createClass({
  propTypes: {
    member: React.PropTypes.object.isRequired,
    currency: React.PropTypes.string.isRequired,
    scale: React.PropTypes.number.isRequired,
  },
  render: function() {
    var props = this.props;
    var member = props.member;

    var balance = _.findWhere(member.balances, { currency: props.currency });

    if (!balance) { // If we add new members and a new currency, the balance is not set
      return null;
    }

    var value = balance.value;

    var amount = new locale.intl.NumberFormat(locale.current, { style: 'currency', currency: props.currency })
      .format(value);

    var styleRect = {
      height: 22,
      position: 'relative',
      paddingTop: 4,
    };

    if (value === 0) {
      styleRect.width = '3px';
      styleRect.background = colors.grey400;
      styleRect.left = '50%';
    } else {
      styleRect.width = Math.abs(value) / props.scale * 50 + '%';

      if (value > 0) {
        styleRect.background = colors.green300;
        styleRect.left = '50%';
      } else {
        styleRect.background = colors.red300;
        styleRect.left = (1 - Math.abs(value) / props.scale) * 50 + '%';
      }
    }

    var avatar = <MemberAvatar member={member} />;

    return <div style={styles.root}>
          <List left={avatar} style={styles.left}>
            {utils.getNameMember(member)}
          </List>
          <div style={styles.right}>
            <div style={styleRect} className="testAccountBalanceChart">
              <span style={styles.rectInner}>{amount}</span>
            </div>
          </div>
      </div>;
  },
});

module.exports = AccountBalanceChart;
