import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui-next/styles';
import classNames from 'classnames';
import AppBar from 'material-ui/AppBar';

const styles = theme => ({
  root: {
    flex: '0 0 auto',
  },
  ios: {
    paddingTop: theme.statusbariOSHeight,
  },
});

const LayoutAppBar = props => {
  const { classes, ...other } = props;

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

export default withStyles(styles)(LayoutAppBar);
