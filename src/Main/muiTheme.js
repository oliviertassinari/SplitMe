import colors from 'material-ui/lib/styles/colors';
import themeManager from 'material-ui/lib/styles/theme-manager';

import defaultRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';
defaultRawTheme.palette = Object.assign({}, defaultRawTheme.palette, {
  primary1Color: colors.green500,
  primary2Color: colors.green700,
  primary3Color: colors.green100,
  accent1Color: colors.red500,
});

const muiTheme = themeManager.getMuiTheme(defaultRawTheme);
muiTheme.appBar = Object.assign({}, muiTheme.appBar, {
  textColor: colors.white,
  height: 56,
});
muiTheme.avatar = Object.assign({}, muiTheme.avatar, {
  borderColor: null,
});

export default muiTheme;
