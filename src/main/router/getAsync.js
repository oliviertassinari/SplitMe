// @flow weak

import React, {Component, PropTypes} from 'react';
import {createStyleSheet} from 'stylishly/lib/styleSheet';
import CircularProgress from 'material-ui-build/src/CircularProgress';

const styleSheet = createStyleSheet('Async', () => ({
  loader: {
    display: 'flex',
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
    textAlign: 'center',
  },
}));

const DISPLAY_LOADER_DELAY = 200;

export default function getAsync(lasyLoad) {
  class Async extends Component {
    static contextTypes = {
      styleManager: PropTypes.object.isRequired,
    };

    state = {
      loaded: false,
      showLoader: false,
      MyComponent: null,
    };

    componentWillMount() {
      this.timer = setTimeout(this.handleTimeout, DISPLAY_LOADER_DELAY);

      lasyLoad((MyComponent) => {
        clearTimeout(this.timer);
        this.setState({
          loaded: true,
          showLoader: false,
          MyComponent: MyComponent,
        });
      });
    }

    componentWillUnMount() {
      clearTimeout(this.timer);
    }

    timer = null;

    handleTimeout = () => {
      this.setState({
        showLoader: true,
      });
    };

    render() {
      const {
        loaded,
        showLoader,
        MyComponent,
      } = this.state;

      if (loaded) {
        return <MyComponent {...this.props} />;
      } else if (showLoader) {
        const classes = this.context.styleManager.render(styleSheet);

        return (
          <div className={classes.loader}>
            <CircularProgress />
          </div>
        );
      } else {
        return null;
      }
    }
  }

  return Async;
}
