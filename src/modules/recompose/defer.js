
import { Component } from 'react';
import createHelper from 'recompose/createHelper';
import createEagerFactory from 'recompose/createEagerFactory';

const defer = (BaseComponent) => {
  const factory = createEagerFactory(BaseComponent);

  return class extends Component {
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
      if (!this.state.show) {
        return null;
      }

      return factory(this.props);
    }
  };
};

export default createHelper(defer, 'defer', true, true);
