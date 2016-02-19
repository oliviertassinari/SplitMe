import React from 'react';
import {StyleRoot, Style} from 'radium';
import MuiThemeProvider from 'material-ui/src/MuiThemeProvider';
import getMuiTheme from 'material-ui/src/styles/getMuiTheme';
import {green500, green700, green100, red500} from 'material-ui/src/styles/colors';

import Modal from 'Main/Modal/Modal';
import Snackbar from 'Main/Snackbar/Snackbar';

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
  avatar: {
    borderColor: null,
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

class Main extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
  };

  render() {
    const {
      children,
    } = this.props;

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <StyleRoot radiumConfig={radiumConfig}>
          <Style rules={rules} />
          {children}
          <Modal />
          <Snackbar />
        </StyleRoot>
      </MuiThemeProvider>
    );
  }
}

export default Main;
