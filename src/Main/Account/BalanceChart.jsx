'use strict';

var React = require('react');
var colors = require('material-ui/lib/styles/colors');

var locale = require('locale');

var styles = {
  root: {
    width: '100%',
  },
  text: {
    fontSize: 6,
  },
};

var AccountBalanceChart = React.createClass({
  propTypes: {
    value: React.PropTypes.number.isRequired,
    scale: React.PropTypes.number.isRequired,
    currency: React.PropTypes.string.isRequired,
  },
  render: function() {
    var props = this.props;

    var amount = new locale.intl.NumberFormat(locale.current, { style: 'currency', currency: props.currency })
      .format(props.value);
    var styleRect = {};
    var rectX;
    var textX;

    if (props.value > 0) {
      styleRect.fill = colors.green400;
      rectX = 40;
      textX = 44;
    } else {
      styleRect.fill = colors.red400;
      rectX = 0;
      textX = 4;
    }

    return <svg style={styles.root} viewBox="0 0 80 10">
        <rect x={rectX} y="0" width="40" height="10" style={styleRect} />
        <text x={textX} y="7" style={styles.text}>{amount}</text>
      </svg>;
  },
});

module.exports = AccountBalanceChart;
