import React, { Component } from 'react';
import createHelper from 'recompose/createHelper';

const defer = BaseComponent => {
  return class extends Component {
    state = {
      show: false,
    };

    componentDidMount() {
      this.timer = setTimeout(() => {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({
          show: true,
        });
      }, 0);
    }

    componentWillUnmount() {
      clearTimeout(this.timer);
    }

    timer = null;

    render() {
      if (!this.state.show) {
        return null;
      }

      return <BaseComponent {...this.props} />;
    }
  };
};

export default createHelper(defer, 'defer', true, true);
