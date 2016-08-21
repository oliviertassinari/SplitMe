// @flow weak

import React, {PropTypes} from 'react';
import {createStyleSheet} from 'stylishly/lib/styleSheet';

const styleSheet = createStyleSheet('LayoutHeader', () => ({
  root: {
    width: '100%',
    position: 'fixed',
    top: 0,
    zIndex: 10,
  },
}));

const LayoutHeader = (props, context) => {
  const classes = context.styleManager.render(styleSheet);

  return (
    <div className={classes.root}>
      {props.children}
    </div>
  );
};

LayoutHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

LayoutHeader.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default LayoutHeader;
