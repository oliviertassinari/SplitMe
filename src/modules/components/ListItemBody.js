import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import { withStyles } from 'material-ui-next/styles';
import { lightBlack } from 'material-ui-next/colors/common';

const styles = {
  root: {
    width: '100%',
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
};

const ListItemBody = props => {
  const { classes, description, right, title } = props;

  return (
    <div className={classes.root}>
      <div className={classes.body} data-test="ListItemBody">
        <span>{title}</span>
        <div className={classes.description}>{description}</div>
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

export default compose(pure, withStyles(styles))(ListItemBody);
