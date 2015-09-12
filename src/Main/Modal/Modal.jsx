'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
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
  onTouchTap: function(dispatchActionType, onTouchTap) {
    this.onDismiss(); // The dialog doesn't trigger it when an a action has an onTouchTap key

    if (dispatchActionType) {
      this.props.dispatch({
        type: dispatchActionType,
      });
    }

    if (onTouchTap) {
      onTouchTap();
    }
  },
  onDismiss: function() {
    this.props.dispatch(modalActions.dismiss());
  },
  render: function() {
    const self = this;

    const actions = [];

    this.props.modal.get('actions').forEach(function(action) {
      const actionRow = {
        text: polyglot.t(action.get('textKey')),
      };

      actionRow.onTouchTap = self.onTouchTap.bind(self, action.get('dispatchActionType'), action.get('onTouchTap'));

      actions.push(actionRow);
    });

    let title = null;

    if (this.props.modal.get('title')) {
      title = <div style={styles.title}>
        {polyglot.t(this.props.modal.get('title'))}
      </div>;
    }

    let description = null;

    if (this.props.modal.get('description')) {
      description = polyglot.t(this.props.modal.get('description'));
    }

    return <CanvasDialog show={this.props.show}>
      <Dialog actions={actions} onDismiss={this.onDismiss} contentClassName="testModal"
        bodyStyle={styles.body}>
        {title}
        {description}
      </Dialog>
    </CanvasDialog>;
  },
});

module.exports = connect()(Modal);
