import React, { Component } from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';

const defer = BaseComponent => {
  class Defer extends Component {
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
  }

  if (process.env.NODE_ENV !== 'production') {
    Defer.displayName = wrapDisplayName(BaseComponent, 'defer');
  }

  return Defer;
};

export default defer;
