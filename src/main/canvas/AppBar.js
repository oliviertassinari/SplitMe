// @flow weak

import React, {PropTypes} from 'react';
import AppBar from 'material-ui-build/src/AppBar';

const styles = {
  ios: {
    paddingTop: 20,
  },
};

const CanvasAppBar = (props) => {
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

CanvasAppBar.propTypes = {
  style: PropTypes.object,
};

export default CanvasAppBar;
