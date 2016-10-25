// @flow weak

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { createStyleSheet } from 'jss-theme-reactor';
import withStyles from 'modules/styles/withStyles';

const styleSheet = createStyleSheet('List', () => ({
  root: {
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    fontSize: 15,
  },
  rootWithoutMargin: {
    padding: '16px 0',
  },
  left: {
    width: 56,
    flexShrink: 0,
  },
  content: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flexGrow: 1,
  },
  right: {
    maxWidth: '45%',
    marginLeft: 16,
    flexShrink: 0,
    wordBreak: 'break-word',
  },
}));

const List = (props) => {
  const {
    children,
    classes,
    left,
    onTouchTap,
    right,
    style,
    withoutMargin,
  } = props;

  return (
    <div
      style={style}
      className={classNames(classes.root, {
        [classes.rootWithoutMargin]: withoutMargin,
      })}
      onTouchTap={onTouchTap}
      data-test="ListItem"
    >
      {left && (
        <div className={classes.left}>
          {left}
        </div>
      )}
      <div className={classes.content}>
        {children}
      </div>
      {right && (
        <div className={classes.right}>
          {right}
        </div>
      )}
    </div>
  );
};

List.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
  left: PropTypes.node,
  onTouchTap: PropTypes.func,
  right: PropTypes.node,
  style: PropTypes.object,
  withoutMargin: PropTypes.bool,
};

List.defaultProps = {
  withoutMargin: false,
};

export default withStyles(styleSheet)(List);
