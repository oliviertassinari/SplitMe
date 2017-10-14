import crashReporter from 'modules/crashReporter/crashReporter';

function crashMiddleware(store) {
  return next => action => {
    crashReporter.captureBreadcrumb({
      message: action.type,
      category: 'redux',
    });

    try {
      const result = next(action);

      crashReporter.setExtraContext({
        state: store.getState(),
        action,
      });

      return result;
    } catch (err) {
      crashReporter.captureException(err);
      throw err;
    }
  };
}

export default crashMiddleware;
