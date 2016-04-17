import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import Dialog from 'material-ui-build/src/Dialog';
import {connect} from 'react-redux';
import FlatButton from 'material-ui-build/src/FlatButton';

import polyglot from 'polyglot';
import modalActions from 'main/modal/actions';

class Modal extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    modal: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    open: React.PropTypes.bool.isRequired,
  };

  onTouchTap = (dispatchAction) => {
    this.handleRequestClose();

    if (dispatchAction) {
      this.props.dispatch(dispatchAction());
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
          onTouchTap={this.onTouchTap.bind(this, action.get('dispatchAction'))}
          label={polyglot.t(action.get('textKey'))}
          data-test={`ModalButton${index}`}
        />
      );

      actions.push(actionNode);
    });

    let description = null;

    if (modal.get('description')) {
      description = polyglot.t(modal.get('description'));
    }

    return (
      <Dialog
        actions={actions}
        onRequestClose={this.handleRequestClose}
        title={modal.get('title') ? polyglot.t(modal.get('title')) : null}
        open={open}
      >
        {description}
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
