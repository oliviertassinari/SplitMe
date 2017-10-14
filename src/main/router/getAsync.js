
import React, { Component, PropTypes } from 'react';
import { createStyleSheet } from 'jss-theme-reactor';
import CircularProgress from 'material-ui-build/src/CircularProgress';
import withStyles from 'material-ui-build-next/src/styles/withStyles';
import Shell from 'modules/components/Shell';

const styleSheet = createStyleSheet('ViewAsync', () => ({
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
}));

const DISPLAY_LOADER_DELAY = 200;

export default function getAsync(lasyLoad) {
  class ViewAsync extends Component {
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

        // Possible improvement:
        // Display the loader for at least 200ms.
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
      }

      return (
        <Shell>
          {showLoader && (
            <div className={classes.loader}>
              <CircularProgress />
            </div>
          )}
        </Shell>
      );
    }
  }

  return withStyles(styleSheet)(ViewAsync);
}
