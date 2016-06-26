import crashReporter from 'modules/crashReporter/crashReporter';

function crashMiddleware(store) {
  const logHistory = [];

  return (next) => (action) => {
    // Store the last 8 pushed actions to the reducers.
    if (logHistory.length === 8) {
      logHistory.shift();
    }
    logHistory.push(action.type);

    crashReporter.setExtraContext({
      logHistory: logHistory,
      state: store.getState(),
    });

    return next(action);
  };
}

export default crashMiddleware;
