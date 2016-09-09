// @flow weak

const utils = {
  isNumber(number) {
    return typeof number === 'number' && isFinite(number);
  },
  parseUrl(url) {
    let result;

    window.location.search
      .replace('?', '')
      .split('&')
      .forEach((item) => {
        const tmp = item.split('=');
        if (tmp[0] === url) {
          result = decodeURIComponent(tmp[1]);
        }
      });

    return result;
  },
  getRoutesPath(renderProps) {
    return renderProps.routes.reduce((complete, {path = ''}) => {
      return path.startsWith('/') ?
        path : complete.endsWith('/') ?
          `${complete}${path}` :
          `${complete}/${path}`;
    }, '');
  },
};

export default utils;
