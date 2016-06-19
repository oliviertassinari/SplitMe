import React, {PropTypes, Component} from 'react';
import {createStyleSheet} from 'stylishly/lib/styleSheet';

import MuiThemeProvider from 'material-ui-build/src/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui-build/src/styles/getMuiTheme';
import {green500, green700, green100, red500} from 'material-ui-build/src/styles/colors';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green500,
    primary2Color: green700,
    primary3Color: green100,
    accent1Color: red500,
  },
  userAgent: process.env.PLATFORM === 'server' ? 'all' : null,
  appBar: {
    height: 56,
  },
});

// Fix an issue with Material-UI and prefixes
if (process.env.PLATFORM === 'server') {
  const prepareStyles = muiTheme.prepareStyles;

  muiTheme.prepareStyles = (style) => {
    style = prepareStyles(style);

    if (typeof style.display === 'object') {
      style.display = style.display.join(';display:');
    }

    return style;
  };
}

const styleSheet = createStyleSheet('Main', () => {
  return {
    '@raw html': {
      background: '#eee',
      WebkitFontSmoothing: 'antialiased',
    },
    '@raw body': {
      margin: 0,
      fontFamily: 'Roboto, sans-serif',
    },
  };
});

class Main extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  static contextTypes = {
    styleManager: PropTypes.object.isRequired,
  };

  render() {
    this.context.styleManager.render(styleSheet);

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        {this.props.children}
      </MuiThemeProvider>
    );
  }
}

export default Main;
