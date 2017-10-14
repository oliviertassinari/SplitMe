import React, { PropTypes, Component } from 'react';
import TextField from 'material-ui-build/src/TextField';
import shallowEqual from 'recompose/shallowEqual';

class AmountField extends Component {
  static propTypes = {
    isInteger: PropTypes.bool,
    onChange: PropTypes.func,
    style: PropTypes.object,
    value: PropTypes.number,
  };

  static defaultProps = {
    isInteger: false,
  };

  state = {};

  componentWillMount() {
    const { value } = this.props;

    this.setState({
      amount: value || null, // Number
      value: value || '', // String
    });
  }

  componentWillReceiveProps(nextProps) {
    const value = nextProps.value;

    if (value !== this.state.amount) {
      this.setState({
        amount: value,
        value,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.state, nextState);
  }

  handleChange = event => {
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

        for (let i = 0; i < value.length; i += 1) {
          const charater = value[i];

          if (charater.match(/[,.]/)) {
            if (!foundSeparator) {
              foundSeparator = true;
            } else {
              value = value.slice(0, i) + value.slice(i + 1);
            }
          } else {
            // Digits
            if (foundSeparator) {
              numberOfDecimal += 1;
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

    this.setState(
      {
        value,
        amount,
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(amount);
        }
      },
    );
  };

  render() {
    const { isInteger, style, ...other } = this.props;

    const hintText = isInteger ? '0' : '0.00';

    return (
      <TextField
        {...other}
        hintText={hintText}
        type="tel"
        value={this.state.value}
        onChange={this.handleChange}
        style={style}
      />
    );
  }
}

export default AmountField;
