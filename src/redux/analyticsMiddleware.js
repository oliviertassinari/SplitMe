import {UPDATE_LOCATION} from 'redux-simple-router';
import pluginAnalytics from 'plugin/analytics';

function analyticsMiddleware(store) {
  return (next) => (action) => {
    const result = next(action);

    if (action && action.type === UPDATE_LOCATION) {
      pluginAnalytics.trackView(store.getState().get('routing').location.pathname);
    }

    return result;
  };
}

export default analyticsMiddleware;
