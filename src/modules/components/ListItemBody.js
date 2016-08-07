// @flow weak

import React, {PropTypes} from 'react';
import pure from 'recompose/pure';
import {createStyleSheet} from 'stylishly/lib/styleSheet';
import {lightBlack} from 'material-ui-build/src/styles/colors';

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

const ListItemBody = (props, context) => {
  const classes = context.styleManager.render(styleSheet);
  const {
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
  description: PropTypes.string,
  right: PropTypes.node,
  title: PropTypes.string,
};

ListItemBody.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default pure(ListItemBody);
