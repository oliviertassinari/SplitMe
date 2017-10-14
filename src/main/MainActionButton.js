import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import classNames from 'classnames';
import pure from 'recompose/pure';
import { withStyles } from 'material-ui-next/styles';
import Transitions from 'material-ui/styles/transitions';
import IconAdd from 'material-ui/svg-icons/content/add';
import withWidth, { isWidthDown } from 'material-ui-next/utils/withWidth';
import { connect } from 'react-redux';
import Button from 'material-ui-next/Button';

const styles = {
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
};

export const MainActionButton = props => {
  const { classes, onTouchTap, moveUp } = props;

  return (
    <Button
      fab
      color="accent"
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
  width: PropTypes.string.isRequired,
};

export default compose(
  pure,
  withStyles(styles),
  withWidth(),
  connect((state, ownProps) => {
    return {
      moveUp: isWidthDown('sm', ownProps.width) ? state.getIn(['snackbar', 'open']) : false,
    };
  }),
)(MainActionButton);
