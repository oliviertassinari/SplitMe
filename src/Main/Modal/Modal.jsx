import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import Dialog from 'material-ui/lib/dialog';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/lib/flat-button';

import polyglot from 'polyglot';
import modalActions from 'Main/Modal/actions';

const styles = {
  body: {
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 16,
  },
};

class Modal extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    modal: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    open: React.PropTypes.bool.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.onTouchTap = this.onTouchTap.bind(this);
  }

  onTouchTap(dispatchAction) {
    this.handleRequestClose();

    if (dispatchAction) {
      this.props.dispatch(dispatchAction());
    }
  }

  handleRequestClose() {
    this.props.dispatch(modalActions.dismiss());
  }

  render() {
    const {
      open,
      modal,
    } = this.props;

    const actions = [];

    modal.get('actions').forEach((action, index) => {
      const actionNode = (
        <FlatButton secondary={true}
          onTouchTap={this.onTouchTap.bind(this, action.get('dispatchAction'))}
          label={polyglot.t(action.get('textKey'))}
          data-test={`ModalButton${index}`}
        />
      );

      actions.push(actionNode);
    });

    let title = null;

    if (modal.get('title')) {
      title = (
        <div style={styles.title}>
          {polyglot.t(modal.get('title'))}
        </div>
      );
    }

    let description = null;

    if (modal.get('description')) {
      description = polyglot.t(modal.get('description'));
    }

    return (
      <Dialog actions={actions} onRequestClose={this.handleRequestClose}
        bodyStyle={styles.body} open={open}
      >
        {title}
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

export default connect(mapStateToProps)(pure(Modal));
