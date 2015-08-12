'use strict';

var Lie = require('lie');
var IntlPolyfill = require('intl');

var polyglot = require('polyglot');

function getCurrent() {
  var current = 'en';

  var availabled = {
    en: true,
    fr: true,
  };

  var language = navigator.language.toLowerCase();

  if (availabled[language]) {
    return language;
  }

  language = language.substring(0, 2);

  if (availabled[language]) {
    return language;
  }

  return current;
}

var _current = getCurrent();

polyglot.locale(_current);

var locale = {
  current: _current,
  intl: IntlPolyfill,
  currencyToString: function(currency) {
    var amount = new locale.intl.NumberFormat(_current, { style: 'currency', currency: currency })
      .format(0);

    return amount.replace(/[0,.\s]/g, '');
  },
  load: function() {
    var localeRequire = require.context('promise?lie!./locale', false, /^.\/(en|fr).js$/);
    var localePromise = localeRequire('./' + _current + '.js');

    var intlRequire = require.context('promise?lie!intl/locale-data/jsonp', false, /^.\/(en|fr).js$/);
    var intlPromise = intlRequire('./' + _current + '.js');

    var promises = [
      localePromise().then(function(phrases) {
        polyglot.extend(phrases);
      }),
      intlPromise(),
    ];

    // moment already include the locale EN
    if (_current !== 'en') {
      var momentRequire = require.context('promise?lie!moment/locale', false, /^.\/(en|fr).js$/);
      var momentPromise = momentRequire('./' + _current + '.js');

      promises.push(momentPromise());
    }

    return Lie.all(promises);
  },
};

module.exports = locale;
