'use strict';

const Colors = require('material-ui/lib/styles/colors');

const theme = {
  getPalette: function() {
    return {
      primary1Color: Colors.green500,
      primary2Color: Colors.green700,
      primary3Color: Colors.green100,
      accent1Color: Colors.red500,
    };
  },
  getComponentThemes: function() {
    return {
      appBar: {
        textColor: Colors.white,
        height: 56,
      },
      avatar: {
        borderColor: null,
      },
    };
  },
};

module.exports = theme;
