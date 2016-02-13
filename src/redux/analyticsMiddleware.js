import {UPDATE_LOCATION} from 'react-router-redux';
import pluginAnalytics from 'plugin/analytics';
import {match} from 'react-router';

import utils from 'utils';
import routes from 'Main/routes';

function analyticsMiddleware(store) {
  return (next) => (action) => {
    const result = next(action);

    if (action && action.type === UPDATE_LOCATION) {
      const location = store.getState().get('routing').location;

      match({
        routes: routes,
        location: location.pathname + location.search,
      }, (error, redirectLocation, renderProps) => {
        // In case of a rediction
        if (renderProps) {
          pluginAnalytics.trackView(utils.getRoutesPath(renderProps));
        }
      });
    }

    return result;
  };
}

export default analyticsMiddleware;
