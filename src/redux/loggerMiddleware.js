function loggerMiddleware(store) {
  return next => action => {
    console.group(action.type);
    console.debug('dispatching', action);
    const result = next(action);
    console.debug('next state', store.getState().toJS());
    console.groupEnd(action.type);
    return result;
  };
}

export default loggerMiddleware;
