// @flow weak

import React, {PropTypes} from 'react';
import classNames from 'classnames';
import {createStyleSheet} from 'stylishly/lib/styleSheet';

const styleSheet = createStyleSheet('LayoutBody', () => ({
  root: {
    margin: '0 0 38px',
  },
  rootResponsive: {
    '@media (min-width: 600px)': {
      width: 'auto',
      marginLeft: 40,
      marginRight: 40,
    },
    '@media (min-width: 920px)': {
      width: 840,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    '@media (min-width: 1260px)': {
      width: '66.66%',
    },
    '@media (min-width: 1800px)': {
      width: 1200,
    },
  },
  rootFullHeight: {
    height: '100%',
    marginBottom: 0,
  },
}));

const LayoutBody = (props, context) => {
  const {
    children,
    fullHeight,
    fullWidth,
    style,
    ...other,
  } = props;

  const classes = context.styleManager.render(styleSheet);

  return (
    <div
      className={classNames(classes.root, {
        [classes.rootResponsive]: !fullWidth,
        [classes.rootFullHeight]: fullHeight,
      })}
      style={style}
      {...other}
    >
      {children}
    </div>
  );
};

LayoutBody.propTypes = {
  children: PropTypes.node,
  fullHeight: PropTypes.bool,
  fullWidth: PropTypes.bool,
  style: PropTypes.object,
};

LayoutBody.defaultProps = {
  fullHeight: false,
  fullWidth: false,
};

LayoutBody.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default LayoutBody;
