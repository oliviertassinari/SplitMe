'use strict';

var utils = {
  isNumber: function(number) {
    return typeof number === 'number' && isFinite(number);
  },
};

module.exports = utils;
