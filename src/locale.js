'use strict';

var Lie = require('lie');
var moment = require('moment');
var IntlPolyfill = require('intl');

var utils = require('./utils');
var polyglot = require('./polyglot');

function getCurrent() {
  var current = 'en';

  var availabled = {
    'en': true,
    'fr': true,
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

function ajax(url) {
  return new Lie(function(resolve) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        resolve(JSON.parse(this.responseText));
      }
    };
    httpRequest.open('GET', url);
    httpRequest.send();
  });
}


var current = getCurrent();

var locale = {
  current: current,
  currencies: {},
  intl: null,
  currencyToString: function(currency) {
    if (locale.currencies[currency]) {
      return locale.currencies[currency];
    } else {
      return currency;
    }
  },
  load: function() {
    // Load moment locale
    if (current !== 'en') {
      window.moment = moment;

      var script = document.createElement('script');
      script.src = utils.baseUrl + '/locale/moment/' + current + '.js';
      document.body.appendChild(script);
    }

    return Lie.all([
      ajax(utils.baseUrl + '/locale/' + current + '.json').then(function(phrases) {
        polyglot.locale(current);
        polyglot.extend(phrases);
      }),
      ajax(utils.baseUrl + '/locale/intl/' + current + '.json').then(function(intl) {
        IntlPolyfill.__addLocaleData(intl);
        locale.intl = IntlPolyfill;

        locale.currencies = intl.number.currencies;
      }),
    ]);
  },
};

module.exports = locale;
