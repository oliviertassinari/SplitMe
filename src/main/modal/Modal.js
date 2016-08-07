// @flow weak

import React, {PropTypes, Component} from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Dialog from 'material-ui-build/src/Dialog';
import {connect} from 'react-redux';
import FlatButton from 'material-ui-build/src/FlatButton';
import modalActions from 'main/modal/actions';

class Modal extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    modal: ImmutablePropTypes.map.isRequired,
    open: PropTypes.bool.isRequired,
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  onTouchTap = (action) => {
    this.handleRequestClose();

    if (action.get('onTouchTap')) {
      this.timer = setTimeout(() => {
        action.get('onTouchTap')();
      }, 200);
    }
  };

  timer = null;

  handleRequestClose = () => {
    this.props.dispatch(modalActions.dismiss());
  };

  render() {
    const {
      open,
      modal,
    } = this.props;

    const actions = modal.get('actions').map((action, index) => {
      return (
        <FlatButton
          key={index}
          primary={true}
          onTouchTap={this.onTouchTap.bind(this, action)}
          label={action.get('label')}
          data-test={`ModalButton${index}`}
        />
      );
    });

    return (
      <Dialog
        actions={actions}
        onRequestClose={this.handleRequestClose}
        title={modal.get('title')}
        open={open}
      >
        {modal.get('description')}
      </Dialog>
    );
  }
}

export default compose(
  pure,
  connect((state) => {
    return {
      open: state.getIn(['screen', 'dialog']) === 'modal',
      modal: state.get('modal'),
    };
  }),
)(Modal);
