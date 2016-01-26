import React from 'react';
import TextField from 'material-ui/lib/text-field';
import shallowEqual from 'fbjs/lib/shallowEqual';

class AmountField extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      amount: props.value || null, // Number
      value: props.value || '', // String
    };
  }

  componentWillReceiveProps(nextProps) {
    const value = nextProps.value;

    if (value !== this.state.amount) {
      this.setState({
        amount: value,
        value: value,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.state, nextState);
  }

  handleChange(event) {
    const target = event.target;
    let value = '';
    let amount = null;

    if (target.value !== '') {
      if (this.props.isInteger) {
        value = target.value.replace(/[^\d]/g, '');
      } else {
        value = target.value.replace(/[^\d.,]/g, '');
        let foundSeparator = false;
        let numberOfDecimal = 0;

        for (let i = 0; i < value.length; i++) {
          const charater = value[i];

          if (charater.match(/[,.]/)) {
            if (!foundSeparator) {
              foundSeparator = true;
            } else {
              value = value.slice(0, i) + value.slice(i + 1);
            }
          } else { // Digits
            if (foundSeparator) {
              numberOfDecimal++;
            }

            if (numberOfDecimal > 2) {
              value = value.slice(0, i);
              break;
            }
          }
        }
      }
    }

    if (value !== '') {
      amount = parseFloat(value.replace(',', '.'));
    }

    this.setState({
      value: value,
      amount: amount,
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(amount);
      }
    });
  }

  render() {
    const {
      isInteger,
      style,
      ...other,
    } = this.props;

    const hintText = isInteger ? '0' : '0.00';

    return (
      <TextField
        {...other} hintText={hintText} type="tel"
        ref="amount" value={this.state.value} onChange={this.handleChange}
        style={style}
      />
    );
  }
}

AmountField.defaultProps = {
  isInteger: false,
};

AmountField.propTypes = {
  isInteger: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  style: React.PropTypes.object,
  value: React.PropTypes.number,
};

export default AmountField;
