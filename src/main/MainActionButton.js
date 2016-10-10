// @flow weak

import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import FloatingActionButton from 'material-ui-build/src/FloatingActionButton';
import Transitions from 'material-ui-build/src/styles/transitions';
import IconAdd from 'material-ui-build/src/svg-icons/content/add';
import { connect } from 'react-redux';

const styles = {
  root: {
    position: 'fixed',
    bottom: 22,
    right: 20,
    transform: 'translate3d(0, 0, 0)',
    transition: Transitions.easeOut('400ms', 'transform'),
  },
  rootSnackbarOpen: {
    transform: 'translate3d(0, -46px, 0)',
  },
};

const MainActionButton = (props) => {
  const {
    onTouchTap,
    isSnackbarOpened,
  } = props;

  let style = styles.root;

  if (isSnackbarOpened) {
    style = Object.assign({}, style, styles.rootSnackbarOpen);
  }

  return (
    <FloatingActionButton
      secondary
      onTouchTap={onTouchTap}
      style={style}
      data-test="MainActionButton"
    >
      <IconAdd />
    </FloatingActionButton>
  );
};

MainActionButton.propTypes = {
  isSnackbarOpened: PropTypes.bool.isRequired,
  onTouchTap: PropTypes.func,
};

export default compose(
  pure,
  connect((state) => {
    return {
      isSnackbarOpened: state.getIn(['snackbar', 'open']),
    };
  }),
)(MainActionButton);
