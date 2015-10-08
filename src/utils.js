'use strict';

const utils = {
  isNumber(number) {
    return typeof number === 'number' && isFinite(number);
  },
};

module.exports = utils;
