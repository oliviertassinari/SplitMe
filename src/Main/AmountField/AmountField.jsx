'use strict';

var React = require('react');
var mui = require('material-ui');
var TextField = mui.TextField;

var AmountField = React.createClass({
  propTypes: {
    defaultValue: React.PropTypes.number.isRequired,
    isInteger: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    className: React.PropTypes.string,
  },

  getDefaultProps: function() {
    return {
      isInteger: false,
    };
  },

  getInitialState: function() {
    return {
      amount: this.props.defaultValue || '', // String
    };
  },

  // componentWillReceiveProps: function(nextProps) {
  //   this.setState({
  //     amount: nextProps.defaultValue,
  //   });
  // },

  onChange: function(event) {
    var target = event.target;
    var amount;

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

      this.setState({
        amount: amount
      });
    } else {
      amount = this.state.amount;

      this.refs.amount.getDOMNode().querySelector('input').value = '';
      this.refs.amount.setState({hasValue: amount});
    }

    if(this.props.onChange) {
      this.props.onChange(parseFloat(amount));
    }
  },

  render: function () {
    var hintText = (this.props.isInteger) ? '0' : '0.00' ;

    return <TextField hintText={hintText} type="number" ref="amount" value={this.state.amount}
      onChange={this.onChange} className={this.props.className} />;
  }
});

module.exports = AmountField;
