'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const TextField = require('material-ui/lib/text-field');

const AmountField = React.createClass({
  propTypes: {
    defaultValue: React.PropTypes.number,
    isInteger: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    style: React.PropTypes.object,
  },
  mixins: [
    PureRenderMixin,
  ],
  getDefaultProps() {
    return {
      isInteger: false,
    };
  },
  getInitialState() {
    return {
      amountNumber: this.props.defaultValue || null, // Number
      amount: this.props.defaultValue || '', // String
    };
  },
  componentWillReceiveProps(nextProps) {
    const defaultValue = nextProps.defaultValue;

    if (defaultValue !== this.state.amountNumber) {
      this.setState({
        amount: defaultValue,
        amountNumber: defaultValue,
      });
    }
  },
  onChange(event) {
    const target = event.target;
    let amount;
    let amountNumber;

    if (target.value !== '' || target.validity.valid) {
      if (this.props.isInteger) {
        amount = target.value.replace(/[^\d]/g, '');
      } else {
        amount = target.value.replace(/[^\d.,]/g, '');
        let foundSeparator = false;
        let numberOfDecimal = 0;

        for (let i = 0; i < amount.length; i++) {
          const charater = amount[i];

          if (charater.match(/[,.]/)) {
            if (!foundSeparator) {
              foundSeparator = true;
            } else {
              amount = amount.slice(0, i) + amount.slice(i + 1);
            }
          } else { // Digits
            if (foundSeparator) {
              numberOfDecimal++;
            }

            if (numberOfDecimal > 2) {
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

    if (this.props.onChange) {
      this.props.onChange(amountNumber);
    }
  },
  render() {
    const {
      isInteger,
      style,
      ...other,
    } = this.props;

    const hintText = isInteger ? '0' : '0.00';

    return (
      <TextField {...other} hintText={hintText} type="number" ref="amount"
        value={this.state.amount} onChange={this.onChange} style={style} />
    );
  },
});

module.exports = AmountField;
