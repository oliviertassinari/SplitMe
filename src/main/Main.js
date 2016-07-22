import React, {PropTypes, Component} from 'react';
import {createStyleSheet} from 'stylishly/lib/styleSheet';
import MuiThemeProvider from 'material-ui-build/src/styles/MuiThemeProvider';

import muiTheme from 'modules/styles/muiTheme';

const styleSheet = createStyleSheet('Main', () => {
  return {
    '@raw html': {
      background: '#eee',
      WebkitFontSmoothing: 'antialiased',
      fontFamily: 'Roboto, sans-serif',
      '@media (max-width: 767px)': {
        userSelect: 'none',
      },
    },
    '@raw body': {
      margin: 0,
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
