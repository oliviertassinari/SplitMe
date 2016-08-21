// @flow weak

import React, {PropTypes} from 'react';
import AppBar from 'material-ui-build/src/AppBar';

const styles = {
  ios: {
    paddingTop: 20,
  },
};

const LayoutAppBar = (props) => {
  if (process.env.PLATFORM === 'ios') {
    const {
      style,
      ...other,
    } = props;

    return (
      <AppBar {...other} style={Object.assign({}, style, styles.ios)} />
    );
  } else {
    return <AppBar {...props} />;
  }
};

LayoutAppBar.propTypes = {
  style: PropTypes.object,
};

export default LayoutAppBar;
