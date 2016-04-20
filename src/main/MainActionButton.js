import React, {PropTypes, Component} from 'react';
import pure from 'recompose/pure';
import FloatingActionButton from 'material-ui-build/src/FloatingActionButton';
import Transitions from 'material-ui-build/src/styles/transitions';
import IconAdd from 'material-ui-build/src/svg-icons/content/add';
import {connect} from 'react-redux';

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

class MainActionButton extends Component {
  static propTypes = {
    isSnackbarOpened: PropTypes.bool.isRequired,
    onTouchTap: PropTypes.func,
  };

  render() {
    const {
      onTouchTap,
      isSnackbarOpened,
    } = this.props;

    let style = styles.root;

    if (isSnackbarOpened) {
      style = Object.assign({}, style, styles.rootSnackbarOpen);
    }

    return (
      <FloatingActionButton
        primary={false}
        secondary={true}
        onTouchTap={onTouchTap}
        style={style}
        data-test="MainActionButton"
      >
        <IconAdd />
      </FloatingActionButton>
    );
  }
}

function mapStateToProps(state) {
  return {
    isSnackbarOpened: state.getIn(['snackbar', 'open']),
  };
}

export default pure(connect(mapStateToProps)(MainActionButton));
