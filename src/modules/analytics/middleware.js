// @flow weak

import { match } from 'react-router';
import { LOCATION_CHANGE } from 'react-router-redux';
import analytics from 'modules/analytics/analytics';
import routes from 'main/router/routes';
import utils from 'utils';

let pathLatest;

function analyticsMiddleware(store) {
  return (next) => (action) => {
    const result = next(action);

    if (action && action.type === LOCATION_CHANGE) {
      const location = store.getState().get('routing').locationBeforeTransitions;

      match({
        routes,
        location: location.pathname + location.search,
      }, (error, redirectLocation, renderProps) => {
        // In case of a rediction
        if (renderProps) {
          const path = utils.getRoutesPath(renderProps);

          // Send unique new path.
          if (path !== pathLatest) {
            analytics.trackView(path);
            pathLatest = path;
          }
        }
      });
    }

    return result;
  };
}

export default analyticsMiddleware;
