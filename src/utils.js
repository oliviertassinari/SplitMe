const utils = {
  isNumber(number) {
    return typeof number === 'number' && Number.isFinite(number);
  },
  parseUrl(url) {
    let result;

    window.location.search
      .replace('?', '')
      .split('&')
      .forEach(item => {
        const tmp = item.split('=');
        if (tmp[0] === url) {
          result = decodeURIComponent(tmp[1]);
        }
      });

    return result;
  },
  getRoutesPath(renderProps) {
    return renderProps.routes.reduce((complete, { path = '' }) => {
      if (path.indexOf('/') === 0) {
        return path;
      }

      if (complete.indexOf('/') === complete.length - 1) {
        return `${complete}${path}`;
      }

      return `${complete}/${path}`;
    }, '');
  },
};

export default utils;
