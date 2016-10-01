// @flow weak

import {match} from 'react-router';
import {LOCATION_CHANGE} from 'react-router-redux';
import analytics from 'modules/analytics/analytics';
import Metric from 'modules/analytics/metric';
import routes from 'main/router/routes';
import utils from 'utils';

let pathLatest;

function analyticsMiddleware(store) {
  return (next) => (action) => {
    const metric = new Metric(action.type);

    metric.start();
    const result = next(action);
    metric.end();

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
            analytics.trackView(path);
            pathLatest = path;
          }
        }
      });
    }

    // Dispatch the timing after the view.
    if (metric.duration > 50) { // Only track events longer than 50 ms.
      analytics.trackTiming('redux', action.type, Math.round(metric.duration));
    }

    return result;
  };
}

export default analyticsMiddleware;
