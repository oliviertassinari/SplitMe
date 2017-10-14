
import React, { PropTypes, Component } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from 'material-ui-build-next/src/Dialog';
import Button from 'material-ui-build-next/src/Button';
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

  handleClick = (action) => {
    this.timer = setTimeout(() => {
      this.handleRequestClose();

      if (action.get('onTouchTap')) {
        action.get('onTouchTap')();
      }
    }, 150);
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

    return (
      <Dialog onRequestClose={this.handleRequestClose} open={open}>
        {modal.get('title') && (
          <DialogTitle>
            {modal.get('title')}
          </DialogTitle>
        )}
        <DialogContent>
          <DialogContentText>
            {modal.get('description')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {modal.get('actions').map((action, index) => {
            return (
              <Button
                key={action.get('label')}
                primary
                onClick={this.handleClick.bind(this, action)}
                data-test={`ModalButton${index}`}
              >
                {action.get('label')}
              </Button>
            );
          })}
        </DialogActions>
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
