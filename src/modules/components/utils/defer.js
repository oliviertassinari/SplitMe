// @flow weak

import React, {Component} from 'react';

export default function defer(MyComponent) {
  class Defer extends Component {
    state = {
      show: false,
    };

    componentDidMount() {
      /* eslint-disable react/no-did-mount-set-state */
      this.timer = setTimeout(() => {
        this.setState({
          show: true,
        });
      }, 0);
      /* eslint-enable react/no-did-mount-set-state */
    }

    componentWillUnMount() {
      clearTimeout(this.timer);
    }

    timer = null;

    render() {
      if (this.state.show) {
        return <MyComponent {...this.props} />;
      } else {
        return null;
      }
    }
  }

  return Defer;
}
