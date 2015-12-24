import colors from 'material-ui/lib/styles/colors';
import themeManager from 'material-ui/lib/styles/theme-manager';

const muiTheme = themeManager.getMuiTheme({
  palette: {
    primary1Color: colors.green500,
    primary2Color: colors.green700,
    primary3Color: colors.green100,
    accent1Color: colors.red500,
  },
}, {
  appBar: {
    height: 56,
  },
  avatar: {
    borderColor: null,
  },
});

export default muiTheme;
