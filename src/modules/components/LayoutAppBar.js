// @flow weak

import React, { PropTypes } from 'react';
import { createStyleSheet } from 'stylishly/lib/styleSheet';
import classNames from 'classnames';
import { STATUSBAR_IOS_HEIGHT } from 'modules/styles/muiTheme';
import AppBar from 'material-ui-build/src/AppBar';

const styleSheet = createStyleSheet('LayoutAppBar', () => ({
  root: {
    flex: '0 0 auto',
  },
  ios: {
    paddingTop: STATUSBAR_IOS_HEIGHT,
  },
}));

const LayoutAppBar = (props, context) => {
  const classes = context.styleManager.render(styleSheet);

  return (
    <AppBar
      className={classNames(classes.root, {
        [classes.ios]: process.env.PLATFORM === 'ios',
      })}
      data-test="AppBar"
      {...props}
    />
  );
};

LayoutAppBar.propTypes = {
  style: PropTypes.object,
};

LayoutAppBar.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default LayoutAppBar;
