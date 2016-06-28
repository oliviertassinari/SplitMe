import React, {PropTypes} from 'react';
import {APPBAR_HEIGHT, STATUSBAR_IOS_HEIGHT} from 'modules/styles/muiTheme';

const styles = {
  root: {
    paddingTop: APPBAR_HEIGHT + (process.env.PLATFORM === 'ios' ? STATUSBAR_IOS_HEIGHT : 0),
  },
};

const CanvasBody = (props) => {
  const {
    children,
    style,
  } = props;

  return (
    <div style={Object.assign({}, styles.root, style)}>
      {children}
    </div>
  );
};

CanvasBody.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

export default CanvasBody;
