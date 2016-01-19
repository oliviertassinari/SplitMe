import IntlPolyfill from 'intl';
import createFormatCache from 'intl-format-cache';
import Lie from 'lie';

import polyglot from 'polyglot';
import utils from 'utils';

const defaultLocale = 'en';

function checkValidLocale(localeName) {
  if (!localeName) {
    return false;
  }

  localeName = localeName.toLowerCase();

  if (locale.availabled.indexOf(localeName) !== -1) {
    return localeName;
  }

  localeName = localeName.substring(0, 2);

  if (locale.availabled.indexOf(localeName) !== -1) {
    return localeName;
  }

  return false;
}

const locale = {
  availabled: [
    'en',
    'fr',
  ],
  iso: {
    en: 'en_US',
    fr: 'fr_FR',
  },
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
    let isValidLocale;

    // Server
    if (req && typeof window === 'undefined') {
      isValidLocale = checkValidLocale(req.query.fb_locale);

      if (isValidLocale) {
        return isValidLocale;
      }

      isValidLocale = checkValidLocale(req.query.locale);

      if (isValidLocale) {
        return isValidLocale;
      }

      const accepts = req.acceptsLanguages(this.availabled);

      if (accepts) { // Not false
        return accepts;
      }
    } else {
      isValidLocale = checkValidLocale(utils.parseUrl('locale'));

      if (isValidLocale) {
        return isValidLocale;
      }

      isValidLocale = checkValidLocale(window.navigator.language);

      if (isValidLocale) {
        return isValidLocale;
      }
    }

    return defaultLocale;
  },
};

export default locale;
