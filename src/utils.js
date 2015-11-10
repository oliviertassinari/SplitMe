const utils = {
  isNumber(number) {
    return typeof number === 'number' && isFinite(number);
  },
};

export default utils;
