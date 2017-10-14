
import IntlPolyfill from 'intl';
import areIntlLocalesSupported from 'intl-locales-supported';
import createFormatCache from 'intl-format-cache';
import polyglot from 'polyglot';
import utils from 'utils';
import warning from 'warning';

const defaultLocale = 'en';

function checkValidLocale(locale, localeName) {
  if (!localeName) {
    return false;
  }

  localeName = localeName.toLowerCase();

  if (locale.available.indexOf(localeName) !== -1) {
    return localeName;
  }

  localeName = localeName.substring(0, 2);

  if (locale.available.indexOf(localeName) !== -1) {
    return localeName;
  }

  return false;
}

const locale = {
  available: [
    'en',
    'fr',
  ],
  data: {
    en: {
      iso: 'en_US',
      firstDayOfWeek: 0,
    },
    fr: {
      iso: 'fr_FR',
      firstDayOfWeek: 1,
    },
  },
  current: null,
  phrases: {},
  numberFormat: () => ({ format: (number) => number }),
  dateTimeFormat: () => ({ format: (date) => date }),
  getFirstDayOfWeek(localeName) {
    return locale.data[localeName].firstDayOfWeek;
  },
  currencyToString(currency) {
    const amount = locale.numberFormat(this.current, {
      style: 'currency',
      currency,
    }).format(0);

    return amount.replace(/[0,.\s]/g, '');
  },
  setCurrent(localeName) {
    this.current = localeName;
    polyglot.locale(localeName);

    warning(this.phrases[localeName] !== undefined, 'The locale is not loaded');
    polyglot.extend(this.phrases[localeName]);

    let NumberFormat;
    let DateTimeFormat;

    if (areIntlLocalesSupported(localeName)) {
      NumberFormat = global.Intl.NumberFormat;
      DateTimeFormat = global.Intl.DateTimeFormat;
    } else {
      NumberFormat = IntlPolyfill.NumberFormat;
      DateTimeFormat = IntlPolyfill.DateTimeFormat;
    }

    this.numberFormat = createFormatCache(NumberFormat);
    this.dateTimeFormat = createFormatCache(DateTimeFormat);
  },
  load(localeName) {
    let localePromise;

    // Feature of webpack not available on node
    if ((process.env.PLATFORM === 'server' && process.env.NODE_ENV !== 'production') ||
      process.env.NODE_ENV === 'test') {
      const phrases = eval('require')(`locale/${localeName}.js`); // eslint-disable-line no-eval

      localePromise = () => Promise.resolve(phrases);
    } else {
      const localeRequire = require.context('promise?lie!./locale', false, /^.\/(en|fr).js$/);
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
      isValidLocale = checkValidLocale(locale, req.url.substring(1, 3));

      if (isValidLocale) {
        return isValidLocale;
      }

      isValidLocale = checkValidLocale(locale, req.query.locale);

      if (isValidLocale) {
        return isValidLocale;
      }

      const accepts = req.acceptsLanguages(this.available);

      if (accepts) { // Not false
        return accepts;
      }
    } else {
      isValidLocale = checkValidLocale(locale, window.location.pathname.substring(1, 3));

      if (isValidLocale) {
        return isValidLocale;
      }

      isValidLocale = checkValidLocale(locale, utils.parseUrl('locale'));

      if (isValidLocale) {
        return isValidLocale;
      }

      isValidLocale = checkValidLocale(locale, window.navigator.language);

      if (isValidLocale) {
        return isValidLocale;
      }
    }

    return defaultLocale;
  },
};

export default locale;
