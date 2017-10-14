
import React, { PropTypes } from 'react';
import { createStyleSheet } from 'jss-theme-reactor';
import classNames from 'classnames';
import AppBar from 'material-ui-build/src/AppBar';
import { STATUSBAR_IOS_HEIGHT } from 'modules/styles/muiTheme';
import withStyles from 'material-ui-build-next/src/styles/withStyles';

const styleSheet = createStyleSheet('LayoutAppBar', () => ({
  root: {
    flex: '0 0 auto',
  },
  ios: {
    paddingTop: STATUSBAR_IOS_HEIGHT,
  },
}));

const LayoutAppBar = (props) => {
  const {
    classes,
    ...other
  } = props;

  return (
    <AppBar
      className={classNames(classes.root, {
        [classes.ios]: process.env.PLATFORM === 'ios',
      })}
      data-test="AppBar"
      {...other}
    />
  );
};

LayoutAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  style: PropTypes.object,
};

export default withStyles(styleSheet)(LayoutAppBar);
