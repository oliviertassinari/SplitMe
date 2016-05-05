import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {StyleRoot, Style} from 'radium';
import MuiThemeProvider from 'material-ui-build/src/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui-build/src/styles/getMuiTheme';
import {green500, green700, green100, red500} from 'material-ui-build/src/styles/colors';
import EventListener from 'react-event-listener';
import {goBack} from 'react-router-redux';

import Modal from 'main/modal/Modal';
import Snackbar from 'main/snackbar/Snackbar';

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
    dispatch: PropTypes.func.isRequired,
  };

  handleBackButton = () => {
    this.props.dispatch(goBack());
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
          <EventListener target="document" onBackButton={this.handleBackButton} />
        </StyleRoot>
      </MuiThemeProvider>
    );
  }
}

export default connect()(Main);
