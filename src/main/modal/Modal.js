import React, {PropTypes, Component} from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import Dialog from 'material-ui-build/src/Dialog';
import {connect} from 'react-redux';
import FlatButton from 'material-ui-build/src/FlatButton';

import modalActions from 'main/modal/actions';

class Modal extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    modal: PropTypes.instanceOf(Immutable.Map).isRequired,
    open: PropTypes.bool.isRequired,
  };

  onTouchTap = (action) => {
    this.handleRequestClose();

    if (action.get('dispatchAction')) {
      this.props.dispatch(action.get('dispatchAction')());
    }

    if (action.get('onTouchTap')) {
      action.get('onTouchTap')();
    }
  };

  handleRequestClose = () => {
    this.props.dispatch(modalActions.dismiss());
  };

  render() {
    const {
      open,
      modal,
    } = this.props;

    const actions = [];

    modal.get('actions').forEach((action, index) => {
      const actionNode = (
        <FlatButton
          primary={true}
          onTouchTap={this.onTouchTap.bind(this, action)}
          label={action.get('textKey')}
          data-test={`ModalButton${index}`}
        />
      );

      actions.push(actionNode);
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

function mapStateToProps(state) {
  return {
    open: state.getIn(['screen', 'dialog']) === 'modal',
    modal: state.get('modal'),
  };
}

export default pure(connect(mapStateToProps)(Modal));
