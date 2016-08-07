// @flow weak

import React, {PropTypes} from 'react';
import pure from 'recompose/pure';
import {createStyleSheet} from 'stylishly/lib/styleSheet';
import {grey500} from 'material-ui-build/src/styles/colors';

const styleSheet = createStyleSheet('TextIcon', () => ({
  root: {
    display: 'flex',
    color: grey500,
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
}));

const TextIcon = (props, context) => {
  const classes = context.styleManager.render(styleSheet);
  const {
    icon,
    text,
  } = props;

  return (
    <div className={classes.root} data-test="TextIcon">
      {icon && <img src={icon} className={classes.icon} alt="" />}
      {text}
    </div>
  );
};

TextIcon.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string.isRequired,
};

TextIcon.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default pure(TextIcon);
