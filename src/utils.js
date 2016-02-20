const utils = {
  isNumber(number) {
    return typeof number === 'number' && isFinite(number);
  },
  parseUrl(val) {
    let result;

    window.location.search
      .replace('?', '')
      .split('&')
      .forEach((item) => {
        const tmp = item.split('=');
        if (tmp[0] === val) {
          result = decodeURIComponent(tmp[1]);
        }
      });

    return result;
  },
  getRoutesPath(renderProps) {
    return renderProps.routes.reduce((path, route) => {
      if (route.path) {
        path += route.path;
      }

      return path;
    }, '');
  },
};

export default utils;
