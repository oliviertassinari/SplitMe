// @flow weak

import {Component, PropTypes} from 'react';
import pure from 'recompose/pure';
import {connect} from 'react-redux';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import registerEvents from 'serviceworker-webpack-plugin/lib/browser/registerEvents';
import applyUpdate from 'serviceworker-webpack-plugin/lib/browser/applyUpdate';
import polyglot from 'polyglot';
import snackbarActions from 'main/snackbar/actions';

class ServiceWorker extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost')
    ) {
      const registration = runtime.register({
        scope: '/', // Use the root.
      });

      registerEvents(registration, {
        onInstalled: () => {
          this.props.dispatch(snackbarActions.show({
            message: polyglot.t('service_worker_installed'),
          }));
        },
        onUpdateReady: () => {
          this.props.dispatch(snackbarActions.show({
            message: polyglot.t('service_worker_update_ready'),
            action: polyglot.t('reload'),
            onActionTouchTap: () => {
              applyUpdate().then(() => {
                window.location.reload();
              });
            },
          }));
        },
      });
    }
  }

  render() {
    return null;
  }
}

export default pure(connect()(ServiceWorker));
