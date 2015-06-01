'use strict';

var React = require('react');
var _ = require('underscore');
var StylePropable = require('material-ui/lib/mixins/style-propable');
var colors = require('material-ui/lib/styles/colors');

var locale = require('locale');

var styles = {
  root: {
    position: 'relative',
  },
  origin: {
    height: '100%',
    position: 'absolute',
    left: '50%',
    borderLeft: '1px dashed ' + colors.grey500,
  },
  bar: {
    height: 56,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
  },
};

var AccountBalanceChart = React.createClass({
  propTypes: {
    members: React.PropTypes.array.isRequired,
    currency: React.PropTypes.string.isRequired,
    style: React.PropTypes.object,
  },
  mixins: [
    StylePropable,
  ],
  render: function() {
    var props = this.props;

    var scale = 0;

    props.members.map(function(member) {
      var balance = _.findWhere(member.balances, { currency: props.currency });
      var value = Math.abs(balance.value);

      if (value > scale) {
        scale = value;
      }
    });

    return <div style={this.mergeAndPrefix(styles.root, props.style)} className="testAccountBalanceChart">
        <div style={styles.origin} />
        {props.members.map(function(member) {
          var balance = _.findWhere(member.balances, { currency: props.currency });
          var value = balance.value;

          var amount = new locale.intl.NumberFormat(locale.current, { style: 'currency', currency: props.currency })
            .format(value);

          var styleRect = {
            width: Math.abs(value) / scale * 50 + '%',
            height: 22,
            position: 'relative',
            paddingTop: 4,
          };

          if (value > 0) {
            styleRect.background = colors.green300;
            styleRect.left = 50 + '%';
          } else {
            styleRect.background = colors.red300;
            styleRect.left = (1 - Math.abs(value) / scale) * 50 + '%';
          }

          return <div style={styles.bar} key={member.id}>
              <div style={styleRect}>{amount}</div>
            </div>;
        })}
      </div>;
  },
});

module.exports = AccountBalanceChart;
