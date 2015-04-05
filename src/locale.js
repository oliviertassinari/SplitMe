'use strict';

var Lie = require('lie');

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

var current = getCurrent();

var locale = {
  getCurrent: function() {
    return current;
  },

  load: function() {
    return new Lie(function(resolve) {
      var httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          var phrases = JSON.parse(this.responseText);
          resolve(phrases);
        }
      };
      httpRequest.open('GET', 'locale/' + current + '.json');
      httpRequest.send();
    });
  },
};

module.exports = locale;
