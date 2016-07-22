// @flow weak

import {LOCATION_CHANGE} from 'react-router-redux';
import pluginAnalytics from 'plugin/analytics';
import {match} from 'react-router';
import utils from 'utils';
import routes from 'main/router/routes';

let pathLatest;

function analyticsMiddleware(store) {
  return (next) => (action) => {
    const result = next(action);

    if (action && action.type === LOCATION_CHANGE) {
      const location = store.getState().get('routing').locationBeforeTransitions;

      match({
        routes: routes,
        location: location.pathname + location.search,
      }, (error, redirectLocation, renderProps) => {
        // In case of a rediction
        if (renderProps) {
          const path = utils.getRoutesPath(renderProps);

          // Send unique new path.
          if (path !== pathLatest) {
            pluginAnalytics.trackView(path);
            pathLatest = path;
          }
        }
      });
    }

    return result;
  };
}

export default analyticsMiddleware;
