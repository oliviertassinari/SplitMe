// @flow weak

import React, {PropTypes} from 'react';
import {createStyleSheet} from 'stylishly/lib/styleSheet';

const styleSheet = createStyleSheet('ScrollView', () => ({
  root: {
    flex: '1 1 auto',
    overflowY: 'auto',
    minHeight: 0,
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
  },
}));

const ScrollView = (props, context) => {
  const classes = context.styleManager.render(styleSheet);
  const {
    children,
  } = props;

  return (
    <div className={classes.root} data-test="ScrollView">
      {children}
    </div>
  );
};

ScrollView.propTypes = {
  children: PropTypes.node.isRequired,
};

ScrollView.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default ScrollView;
