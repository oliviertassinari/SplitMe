'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Immutable = require('immutable');
const Dialog = require('material-ui/lib/dialog');
const {connect} = require('react-redux');

const polyglot = require('polyglot');
const modalActions = require('Main/Modal/actions');
const CanvasDialog = require('Main/Canvas/Dialog');

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

const Modal = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    modal: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    show: React.PropTypes.bool.isRequired,
  },
  mixins: [
    PureRenderMixin,
  ],
  onTouchTap(dispatchAction, onTouchTap) {
    this.onDismiss(); // The dialog doesn't trigger it when an a action has an onTouchTap key

    if (dispatchAction) {
      this.props.dispatch(dispatchAction());
    }

    if (onTouchTap) {
      onTouchTap();
    }
  },
  onDismiss() {
    if (this.props.show) {
      this.props.dispatch(modalActions.dismiss());
    }
  },
  render() {
    const {
      show,
      modal,
    } = this.props;

    const actions = [];

    modal.get('actions').forEach((action) => {
      const actionRow = {
        text: polyglot.t(action.get('textKey')),
      };

      actionRow.onTouchTap = this.onTouchTap.bind(this, action.get('dispatchAction'), action.get('onTouchTap'));

      actions.push(actionRow);
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
      <CanvasDialog show={show}>
        <Dialog actions={actions} onDismiss={this.onDismiss} contentClassName="testModal"
          bodyStyle={styles.body}>
          {title}
          {description}
        </Dialog>
      </CanvasDialog>
    );
  },
});

function mapStateToProps(state) {
  return {
    show: state.getIn(['screen', 'dialog']) === 'modal',
    modal: state.get('modal'),
  };
}

module.exports = connect(mapStateToProps)(Modal);
