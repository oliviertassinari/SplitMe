// @flow weak

import getMuiTheme from 'material-ui-build/src/styles/getMuiTheme';
import {green500, green700, green100, red500} from 'material-ui-build/src/styles/colors';

export const STATUSBAR_IOS_HEIGHT = 20;

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

export default muiTheme;
