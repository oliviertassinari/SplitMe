'use strict';

var React = require('react');
var TextField = require('material-ui/lib/text-field');

var AmountField = React.createClass({
  propTypes: {
    defaultValue: React.PropTypes.number,
    isInteger: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    style: React.PropTypes.object,
    className: React.PropTypes.string,
  },
  getDefaultProps: function() {
    return {
      isInteger: false,
    };
  },
  getInitialState: function() {
    return {
      amountNumber: this.props.defaultValue || null, // Number
      amount: this.props.defaultValue || '', // String
    };
  },
  componentWillReceiveProps: function(nextProps) {
    var defaultValue = nextProps.defaultValue;

    if (defaultValue !== this.state.amountNumber) {
      this.setState({
        amount: defaultValue,
        amountNumber: defaultValue,
      });
    }
  },
  onChange: function(event) {
    var target = event.target;
    var amount;
    var amountNumber;

    if(target.value !== '' || target.validity.valid) {
      if(this.props.isInteger) {
        amount = target.value.replace(/[^\d]/g, '');
      } else {
        amount = target.value.replace(/[^\d.,]/g, '');
        var foundSeparator = false;
        var numberOfDecimal = 0;

        for(var i = 0; i < amount.length; i++) {
          var charater = amount[i];

          if(charater.match(/[,.]/)) {
            if(!foundSeparator) {
              foundSeparator = true;
            } else {
              amount = amount.slice(0, i) + amount.slice(i + 1);
            }
          } else { // Digits
            if(foundSeparator) {
              numberOfDecimal++;
            }

            if(numberOfDecimal > 2) {
              amount = amount.slice(0, i);
              break;
            }
          }
        }
      }

      amountNumber = parseFloat(amount);

      this.setState({
        amount: amount,
        amountNumber: amountNumber,
      });
    } else {
      amount = this.state.amount;
      amountNumber = this.state.amountNumber;

      this.refs.amount.getDOMNode().querySelector('input').value = '';
      this.refs.amount.setState({hasValue: amount});
    }

    if(this.props.onChange) {
      this.props.onChange(amountNumber);
    }
  },
  render: function () {
    var hintText = (this.props.isInteger) ? '0' : '0.00';

    return <TextField hintText={hintText} type="number" ref="amount" value={this.state.amount}
      onChange={this.onChange} style={this.props.style} className={this.props.className} />;
  },
});

module.exports = AmountField;
