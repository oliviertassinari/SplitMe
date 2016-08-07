// @flow weak

import React, {PropTypes} from 'react';
import {createStyleSheet} from 'stylishly/lib/styleSheet';

const styleSheet = createStyleSheet('CanvasHeader', () => ({
  root: {
    width: '100%',
    position: 'fixed',
    zIndex: 10,
  },
}));

const CanvasHeader = (props, context) => {
  const classes = context.styleManager.render(styleSheet);

  return (
    <div className={classes.root}>
      {props.children}
    </div>
  );
};

CanvasHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

CanvasHeader.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default CanvasHeader;
