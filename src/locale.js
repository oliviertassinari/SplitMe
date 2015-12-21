import IntlPolyfill from 'intl';
import createFormatCache from 'intl-format-cache';

import polyglot from 'polyglot';

function parse(val) {
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
}

function getCurrent() {
  const defaultLocale = 'en';

  const availabled = [
    'en',
    'fr',
  ];

  let language = parse('locale');

  if (availabled.indexOf(language) !== -1) {
    return language;
  }

  language = navigator.language.toLowerCase();

  if (availabled.indexOf(language) !== -1) {
    return language;
  }

  language = language.substring(0, 2);

  if (availabled.indexOf(language) !== -1) {
    return language;
  }

  return defaultLocale;
}

const _current = getCurrent();

polyglot.locale(_current);

const locale = {
  current: _current,
  numberFormat: createFormatCache(IntlPolyfill.NumberFormat),
  dateTimeFormat: createFormatCache(IntlPolyfill.DateTimeFormat),
  currencyToString(currency) {
    const amount = locale.numberFormat(_current, {
      style: 'currency',
      currency: currency,
    }).format(0);

    return amount.replace(/[0,.\s]/g, '');
  },
  load() {
    const localeRequire = require.context('promise?lie!./locale', false, /^.\/(en|fr).js$/);
    const localePromise = localeRequire('./' + _current + '.js');

    return localePromise().then((phrases) => {
      polyglot.extend(phrases.default);
    });
  },
};

export default locale;
