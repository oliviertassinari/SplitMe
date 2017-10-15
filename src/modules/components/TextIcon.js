import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { withStyles } from 'material-ui-next/styles';
import grey from 'material-ui-next/colors/grey';

const styles = {
  root: {
    display: 'flex',
    color: grey[500],
    fontSize: 21,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 25,
    height: '60vh',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  icon: {
    width: '35%',
    maxWidth: 150,
    height: 150,
    marginBottom: 30,
    display: 'block',
  },
};

const TextIcon = props => {
  const { classes, icon, text } = props;

  return (
    <div className={classes.root} data-test="TextIcon">
      {icon && <img src={icon} className={classes.icon} alt="" />}
      {text}
    </div>
  );
};

TextIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  icon: PropTypes.string,
  text: PropTypes.string.isRequired,
};

export default compose(pure, withStyles(styles))(TextIcon);
