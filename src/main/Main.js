// @flow weak

import React, { PropTypes } from 'react';
import { createStyleSheet } from 'stylishly/lib/styleSheet';
import MuiThemeProvider from 'material-ui-build/src/styles/MuiThemeProvider';
import muiTheme from 'modules/styles/muiTheme';

const styleSheet = createStyleSheet('Main', () => ({
  '@raw html': {
    background: '#eee',
    WebkitFontSmoothing: 'antialiased', // Antialiasing.
    MozOsxFontSmoothing: 'grayscale', // Antialiasing.
    fontFamily: 'Roboto, sans-serif',
    '@media (max-width: 767px)': {
      userSelect: 'none',
    },
  },
  '@raw body': {
    margin: 0,
  },
}));

const Main = (props, context) => {
  context.styleManager.render(styleSheet);

  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      {props.children}
    </MuiThemeProvider>
  );
};

Main.propTypes = {
  children: PropTypes.node.isRequired,
};

Main.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default Main;
