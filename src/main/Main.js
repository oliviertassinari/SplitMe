// @flow weak

import React, { PropTypes } from 'react';
import { createStyleSheet } from 'jss-theme-reactor';
import MuiThemeProviderOld from 'material-ui-build/src/styles/MuiThemeProvider';
import withStyles from 'material-ui-build-next/src/styles/withStyles';
import muiTheme from 'modules/styles/muiTheme';

const styleSheet = createStyleSheet('Main', () => ({
  '@global': {
    html: {
      background: '#eee',
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
      fontFamily: 'Roboto, sans-serif',
      // Waiting for https://github.com/cssinjs/jss-global/issues/4
      // '@media (max-width: 767px)': {
      //   userSelect: 'none',
      // },
    },
    body: {
      margin: 0,
    },
  },
}));

const Main = (props) => {
  return (
    <MuiThemeProviderOld muiTheme={muiTheme}>
      {props.children}
    </MuiThemeProviderOld>
  );
};

Main.propTypes = {
  children: PropTypes.node.isRequired,
};

export default withStyles(styleSheet)(Main);
