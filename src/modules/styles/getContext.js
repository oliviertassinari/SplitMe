import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { createMuiTheme } from 'material-ui-next/styles';
import green from 'material-ui-next/colors/green';
import red from 'material-ui-next/colors/red';
import { create, SheetsRegistry } from 'jss';
import preset from 'jss-preset-default';
import createGenerateClassName from 'material-ui-next/styles/createGenerateClassName';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green[500],
    primary2Color: green[700],
    primary3Color: green[100],
    accent1Color: red[500],
    pickerHeaderColor: green[500],
  },
  userAgent: process.env.PLATFORM === 'server' ? 'all' : null,
  appBar: {
    height: 56,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: green,
    accent: red,
  },
  statusbariOSHeight: 20,
});

// Configure JSS
const jss = create(preset());
jss.options.createGenerateClassName = createGenerateClassName;

function createContext() {
  return {
    jss,
    theme,
    muiTheme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
  };
}

export default function getContext() {
  // Make sure to create a new store for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return createContext();
  }

  // Reuse context on the client-side
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createContext();
  }

  return global.__INIT_MATERIAL_UI__;
}
