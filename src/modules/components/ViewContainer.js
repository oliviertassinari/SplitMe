// @flow weak

import React, { PropTypes } from 'react';
import { createStyleSheet } from 'stylishly/lib/styleSheet';

const styleSheet = createStyleSheet('ViewContainer', () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
}));

const ViewContainer = (props, context) => {
  const classes = context.styleManager.render(styleSheet);
  const {
    children,
  } = props;

  return (
    <div className={classes.root}>
      {children}
    </div>
  );
};

ViewContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

ViewContainer.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default ViewContainer;
