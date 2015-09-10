'use strict';

const React = require('react');
const Immutable = require('immutable');
const colors = require('material-ui/lib/styles/colors');
const StylePropable = require('material-ui/lib/mixins/style-propable');

const locale = require('locale');
const polyglot = require('polyglot');

const styles = {
  root: {
    textAlign: 'right',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row-reverse',
    order: 1,
    margin: '-10px 0',
    maxWidth: '45%',
    wordBreak: 'break-word',
    flexShrink: 0,
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

const ListBalance = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  },
  mixins: [
    StylePropable,
    React.addons.PureRenderMixin,
  ],
  render: function() {
    const self = this;

    // My balances
    const balances = this.props.account.getIn(['members', 0, 'balances'])
      .filter(function(balance) {
        return Math.round(balance.get('value') * 100) !== 0;
      });

    if (balances.size > 0) {
      const positives = [];
      const negatives = [];

      balances.forEach(function(balance) {
        const amount = new locale.intl.NumberFormat(locale.current, {
          style: 'currency',
          currency: balance.get('currency'),
        }).format(Math.abs(balance.get('value')));

        if (balance.get('value') < 0) {
          negatives.push(
            <div key={balance.get('currency')} style={self.mergeAndPrefix(styles.negatives, styles.amount)}>
              {amount}
            </div>
          );
        } else { // > 0
          positives.push(
            <div key={balance.get('currency')} style={self.mergeAndPrefix(styles.positives, styles.amount)}>
              {amount}
            </div>
          );
        }
      });

      const balancesNode = [];

      if (negatives.length) {
        balancesNode.push(<div key="negatives" style={styles.group}>
            <div style={this.mergeAndPrefix(styles.negatives, styles.body)}>
              {polyglot.t('you_owe')}
            </div>
            {negatives}
          </div>
        );
      }

      if (positives.length) {
        balancesNode.push(<div key="positives" style={styles.group}>
            <div style={this.mergeAndPrefix(styles.positives, styles.body)}>
              {polyglot.t('owes_you')}
            </div>
            {positives}
          </div>
        );
      }

      return <div style={styles.root} className="testListBalance">
          {balancesNode}
        </div>;
    } else {
      return <span style={styles.neutrale} className="testListBalance">
          {polyglot.t('settled_up')}
        </span>;
    }
  },
});

module.exports = ListBalance;
