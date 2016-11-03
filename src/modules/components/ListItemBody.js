// @flow weak

import React, { PropTypes } from 'react';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import { createStyleSheet } from 'jss-theme-reactor';
import { lightBlack } from 'material-ui-build/src/styles/colors';
import withStyles from 'modules/styles/withStyles';

const styleSheet = createStyleSheet('ListItemBody', () => ({
  root: {
    display: 'flex',
  },
  body: {
    flexGrow: 1,
  },
  description: {
    fontSize: 12,
    lineHeight: '20px',
    color: lightBlack,
  },
  right: {
    flexShrink: 0,
    wordBreak: 'break-word',
    maxWidth: '45%',
  },
}));

const ListItemBody = (props) => {
  const {
    classes,
    description,
    right,
    title,
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.body} data-test="ListItemBody">
        <span>{title}</span>
        <div className={classes.description}>
          {description}
        </div>
      </div>
      <span className={classes.right} data-test="ListItemBodyRight">
        {right}
      </span>
    </div>
  );
};

ListItemBody.propTypes = {
  classes: PropTypes.object.isRequired,
  description: PropTypes.string,
  right: PropTypes.node,
  title: PropTypes.string,
};

export default compose(
  pure,
  withStyles(styleSheet),
)(ListItemBody);
