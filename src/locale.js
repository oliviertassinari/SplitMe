import IntlPolyfill from 'intl';
import createFormatCache from 'intl-format-cache';
import Lie from 'lie';

import polyglot from 'polyglot';
import utils from 'utils';

const defaultLocale = 'en';

const availabled = [
  'en',
  'fr',
];

const locale = {
  current: null,
  phrases: {},
  numberFormat: createFormatCache(IntlPolyfill.NumberFormat),
  dateTimeFormat: createFormatCache(IntlPolyfill.DateTimeFormat),
  currencyToString(currency) {
    const amount = locale.numberFormat(this.current, {
      style: 'currency',
      currency: currency,
    }).format(0);

    return amount.replace(/[0,.\s]/g, '');
  },
  setCurrent(localeName) {
    this.current = localeName;
    polyglot.locale(localeName);
    polyglot.extend(this.phrases[localeName]);
  },
  load(localeName) {
    let localeRequire;
    let localePromise;

    // Feature of webpack not availabled on node
    if (process.env.PLATFORM === 'server' && process.env.NODE_ENV !== 'production') {
      const phrases = eval('require')(`locale/${localeName}.js`);

      localePromise = () => {
        return new Lie((resolve) => {
          resolve(phrases);
        });
      };
    } else {
      localeRequire = require.context('promise?lie!./locale', false, /^.\/(en|fr).js$/);
      localePromise = localeRequire(`./${localeName}.js`);
    }

    return localePromise().then((phrases) => {
      this.phrases[localeName] = phrases.default;
    });
  },
  getBestLocale(req) {
    // Server
    if (typeof window === 'undefined' && req) {
      const accepts = req.acceptsLanguages(availabled);

      if (accepts) { // Not false
        return accepts;
      }
    } else {
      let language = utils.parseUrl('locale');

      if (availabled.indexOf(language) !== -1) {
        return language;
      }

      language = window.navigator.language.toLowerCase();

      if (availabled.indexOf(language) !== -1) {
        return language;
      }

      language = language.substring(0, 2);

      if (availabled.indexOf(language) !== -1) {
        return language;
      }
    }

    return defaultLocale;
  },
};

export default locale;
