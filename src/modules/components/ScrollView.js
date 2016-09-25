// @flow weak

import React, {PropTypes} from 'react';
import classNames from 'classnames';
import {createStyleSheet} from 'stylishly/lib/styleSheet';

const styleSheet = createStyleSheet('ScrollView', () => ({
  root: {
    flex: '1 1 auto',
    overflowY: 'auto',
    minHeight: 0,
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
  },
  fullHeight: {
    height: '100%',
  },
}));

const ScrollView = (props, context) => {
  const classes = context.styleManager.render(styleSheet);
  const {
    children,
    fullHeight,
    ...other,
  } = props;

  return (
    <div
      className={classNames(classes.root, {
        [classes.fullHeight]: fullHeight,
      })}
      {...other}
    >
      {children}
    </div>
  );
};

ScrollView.propTypes = {
  children: PropTypes.node.isRequired,
  fullHeight: PropTypes.bool,
};

ScrollView.defaultProps = {
  fullHeight: false,
};

ScrollView.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default ScrollView;
