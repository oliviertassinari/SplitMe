// @flow weak

const babelRegister = require('babel-register');

babelRegister({
  only: /^material-ui|src|test/,
});
