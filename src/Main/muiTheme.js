'use strict';

const Colors = require('material-ui/lib/styles/colors');
const ThemeManager = require('material-ui/lib/styles/theme-manager');

const defaultRawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme');
defaultRawTheme.palette = Object.assign({}, defaultRawTheme.palette, {
  primary1Color: Colors.green500,
  primary2Color: Colors.green700,
  primary3Color: Colors.green100,
  accent1Color: Colors.red500,
});

const muiTheme = ThemeManager.getMuiTheme(defaultRawTheme);
muiTheme.appBar = Object.assign({}, muiTheme.appBar, {
  textColor: Colors.white,
  height: 56,
});
muiTheme.avatar = Object.assign({}, muiTheme.avatar, {
  borderColor: null,
});

module.exports = muiTheme;
