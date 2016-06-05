import React, {PropTypes, Component} from 'react';
import {StyleRoot, Style} from 'radium';
import MuiThemeProvider from 'material-ui-build/src/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui-build/src/styles/getMuiTheme';
import {green500, green700, green100, red500} from 'material-ui-build/src/styles/colors';

const userAgent = typeof window !== 'undefined' ? null : 'all';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green500,
    primary2Color: green700,
    primary3Color: green100,
    accent1Color: red500,
  },
  userAgent: userAgent,
  appBar: {
    height: 56,
  },
});

const rules = {
  html: {
    background: '#eee',
    WebkitFontSmoothing: 'antialiased',
  },
  body: {
    margin: 0,
    fontFamily: 'Roboto, sans-serif',
  },
};

const radiumConfig = {
  userAgent: userAgent,
};

class Main extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <StyleRoot radiumConfig={radiumConfig}>
          <Style rules={rules} />
          {this.props.children}
        </StyleRoot>
      </MuiThemeProvider>
    );
  }
}

export default Main;
