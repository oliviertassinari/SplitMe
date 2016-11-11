// @flow weak

import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import classNames from 'classnames';
import pure from 'recompose/pure';
import { createStyleSheet } from 'jss-theme-reactor';
import Transitions from 'material-ui-build/src/styles/transitions';
import IconAdd from 'material-ui-build/src/svg-icons/content/add';
import withStyles from 'modules/styles/withStyles';
import withWidth, { SMALL } from 'material-ui-build/src/utils/withWidth';
import { connect } from 'react-redux';
import Button from 'material-ui-build-next/src/Button';

const styleSheet = createStyleSheet('MainActionButton', () => ({
  root: {
    position: 'fixed',
    bottom: 22,
    right: 20,
    transform: 'translate3d(0, 0, 0)',
    transition: Transitions.easeOut('400ms', 'transform'),
  },
  rootMoveUp: {
    transform: 'translate3d(0, -46px, 0)',
  },
}));

export const MainActionButton = (props) => {
  const {
    classes,
    onTouchTap,
    moveUp,
  } = props;

  return (
    <Button
      fab
      accent
      onClick={onTouchTap}
      className={classNames(classes.root, {
        [classes.rootMoveUp]: moveUp,
      })}
      data-test="MainActionButton"
    >
      <IconAdd color="#fff" />
    </Button>
  );
};

MainActionButton.propTypes = {
  classes: PropTypes.object.isRequired,
  moveUp: PropTypes.bool.isRequired,
  onTouchTap: PropTypes.func,
  width: PropTypes.number.isRequired,
};

export default compose(
  pure,
  withStyles(styleSheet),
  withWidth(),
  connect((state, ownProps) => {
    return {
      moveUp: ownProps.width === SMALL ?
        state.getIn(['snackbar', 'open']) :
        false,
    };
  }),
)(MainActionButton);
