// @flow weak

import React, {PropTypes} from 'react';
import classNames from 'classnames';
import {APPBAR_HEIGHT, STATUSBAR_IOS_HEIGHT} from 'modules/styles/muiTheme';
import {createStyleSheet} from 'stylishly/lib/styleSheet';

const styleSheet = createStyleSheet('LayoutBody', () => ({
  root: {
    margin: '38px 0',
    marginTop: APPBAR_HEIGHT,
    paddingTop: process.env.PLATFORM === 'ios' ? STATUSBAR_IOS_HEIGHT : 0,
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
}));

const LayoutBody = (props, context) => {
  const {
    children,
    full,
    style,
  } = props;

  const classes = context.styleManager.render(styleSheet);

  return (
    <div
      className={classNames(classes.root, {
        [classes.rootResponsive]: !full,
      })}
      style={style}
    >
      {children}
    </div>
  );
};

LayoutBody.propTypes = {
  children: PropTypes.node,
  full: PropTypes.bool,
  style: PropTypes.object,
};

LayoutBody.defaultProps = {
  full: false,
};

LayoutBody.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default LayoutBody;
