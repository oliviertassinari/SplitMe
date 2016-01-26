import React from 'react';
import pure from 'recompose/pure';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import Transitions from 'material-ui/lib/styles/transitions';
import IconAdd from 'material-ui/lib/svg-icons/content/add';
import {connect} from 'react-redux';

const styles = {
  root: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    transform: 'translate3d(0, 0, 0)',
    transition: Transitions.easeOut('400ms', 'transform'),
  },
  rootSnackbarOpen: {
    transform: 'translate3d(0, -46px, 0)',
  },
};

class MainActionButton extends React.Component {
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
      <FloatingActionButton onTouchTap={onTouchTap} style={style} data-test="MainActionButton">
        <IconAdd />
      </FloatingActionButton>
    );
  }
}

MainActionButton.propTypes = {
  isSnackbarOpened: React.PropTypes.bool.isRequired,
  onTouchTap: React.PropTypes.func,
};

function mapStateToProps(state) {
  return {
    isSnackbarOpened: state.getIn(['snackbar', 'open']),
  };
}

export default connect(mapStateToProps)(pure(MainActionButton));
