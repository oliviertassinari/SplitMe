'use strict';

var React = require('react');
var colors = require('material-ui/lib/styles/colors');
var StylePropable = require('material-ui/lib/mixins/style-propable');

var locale = require('../../locale');
var polyglot = require('../../polyglot');

var styles = {
  root: {
    textAlign: 'right',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row-reverse',
  },
  group: {
    marginLeft: 8,
  },
  body: {
    lineHeight: '13px',
    fontSize: 13,
  },
  amount: {
    fontSize: 20,
    lineHeight: '28px',
    fontWeight: 500,
    marginLeft: 8,
  },
  negatives: {
    color: colors.pink500,
  },
  positives: {
    color: colors.green600,
  },
  neutrale: {
    color: colors.grey600,
  },
};

var ListBalance = React.createClass({
  mixins: [
    StylePropable,
  ],
  propTypes: {
    account: React.PropTypes.object.isRequired,
  },
  render: function() {
    var self = this;
    var member = this.props.account.members[0]; // Me
    var balances = member.balances.filter(function(balance) {
      return balance.value !== 0;
    });

    if (balances.length > 0) {
      var positives = [];
      var negatives = [];

      balances.forEach(function(balance) {
        var amount = new locale.intl.NumberFormat(locale.current, { style: 'currency', currency: balance.currency })
          .format(Math.abs(balance.value));

        if(balance.value < 0) {
          negatives.push(
            <div key={balance.currency} style={self.mergeAndPrefix(styles.negatives, styles.amount)}>
              {amount}
            </div>
          );
        } else { // > 0
          positives.push(
            <div key={balance.currency} style={self.mergeAndPrefix(styles.positives, styles.amount)}>
              {amount}
            </div>
          );
        }
      });

      var balancesNode = [];

      if(negatives.length) {
        balancesNode.push(<div key="negatives" style={styles.group}>
            <div style={this.mergeAndPrefix(styles.negatives, styles.body)}>
              {polyglot.t('you_owe')}
            </div>
            {negatives}
          </div>
        );
      }

      if(positives.length) {
        balancesNode.push(<div key="positives" style={styles.group}>
            <div style={this.mergeAndPrefix(styles.positives, styles.body)}>
              {polyglot.t('owes_you')}
            </div>
            {positives}
          </div>
        );
      }

      return <div style={styles.root}>
          {balancesNode}
        </div>;
    } else {
      return <span style={styles.neutrale}>
          {polyglot.t('settled_up')}
        </span>;
    }
  },
});

module.exports = ListBalance;
