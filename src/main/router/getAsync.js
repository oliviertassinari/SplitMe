// @flow weak

import React, { Component, PropTypes } from 'react';
import { createStyleSheet } from 'jss-theme-reactor';
import CircularProgress from 'material-ui-build/src/CircularProgress';
import withStyles from 'material-ui-build-next/src/styles/withStyles';

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
    static propTypes = {
      classes: PropTypes.object.isRequired,
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
          MyComponent,
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

      const {
        classes,
        ...other
      } = this.props;

      if (loaded) {
        return <MyComponent {...other} />;
      } else if (showLoader) {
        return (
          <div className={classes.loader}>
            <CircularProgress />
          </div>
        );
      }

      return null;
    }
  }

  return withStyles(styleSheet)(Async);
}
