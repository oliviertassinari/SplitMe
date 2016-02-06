import pluginAnalytics from 'plugin/analytics';

function crashMiddleware() {
  return (next) => (action) => {
    try {
      return next(action);
    } catch (err) {
      pluginAnalytics.trackException(`${action.type} - ${err}`, true);

      console.error('Caught an exception!', err);
    }
  };
}

export default crashMiddleware;
