import React, {Component} from 'react';
import CircularProgress from 'material-ui-build/src/CircularProgress';

const styles = {
  loader: {
    display: 'flex',
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
    textAlign: 'center',
  },
};

const DISPLAY_LOADER_DELAY = 200;

export default function getAsync(lasyLoad) {
  class Async extends Component {
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
        return (
          <div style={styles.loader}>
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
