import React from 'react';
import {StyleRoot, Style} from 'radium';
import themeDecorator from 'material-ui/src/styles/theme-decorator';
import getMuiTheme from 'material-ui/src/styles/getMuiTheme';
import colors from 'material-ui/src/styles/colors';

import Modal from 'Main/Modal/Modal';
import Snackbar from 'Main/Snackbar/Snackbar';

const userAgent = typeof window !== 'undefined' ? null : 'all';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: colors.green500,
    primary2Color: colors.green700,
    primary3Color: colors.green100,
    accent1Color: colors.red500,
  },
}, {
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
      <StyleRoot radiumConfig={radiumConfig}>
        {children}
        <Modal />
        <Snackbar />
        <Style rules={rules} />
      </StyleRoot>
    );
  }
}

export default themeDecorator(muiTheme)(Main);
