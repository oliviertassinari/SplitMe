'use strict';

var React = require('react');
var mui = require('material-ui');
var TextField = mui.TextField;

var AmountFielView = React.createClass({
  propTypes: {
    defaultValue: React.PropTypes.string,
    isInteger: React.PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      isInteger: false,
    };
  },

  getInitialState: function() {
    return {
      amount: this.props.defaultValue || '',
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (typeof nextProps.defaultValue === 'string') {
      this.setState({
        amount: nextProps.defaultValue
      });
    }
  },

  onChange: function(event) {
    var target = event.target;

    if(target.value !== '' || target.validity.valid) {
      var amount;

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
      this.refs.amount.getDOMNode().querySelector('input').value = '';
      this.refs.amount.setState({hasValue: this.state.amount});
    }
  },

  render: function () {
    var hintText = (this.props.isInteger) ? '0' : '0.00' ;

    return <TextField hintText={hintText} type="number" ref="amount" value={this.state.amount}
      onChange={this.onChange} />;
  }
});

module.exports = AmountFielView;
