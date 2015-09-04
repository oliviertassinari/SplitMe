'use strict';

var React = require('react');
var Immutable = require('immutable');
var Dialog = require('material-ui/lib/dialog');
var connect = require('react-redux').connect;

var polyglot = require('polyglot');
var modalActions = require('Main/Modal/actions');
var CanvasDialog = require('Main/Canvas/Dialog');

var styles = {
  body: {
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 16,
  },
};

var Modal = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    modal: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    show: React.PropTypes.bool.isRequired,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  onClickOK: function(triggerName) {
    this.onDismiss(); // The dialog doesn't trigger it when an a action has an onClick key
    this.props.dispatch(modalActions.tapOK(triggerName));
  },
  onDismiss: function() {
    this.props.dispatch(modalActions.dismiss());
  },
  render: function() {
    var self = this;

    var actions = [];

    this.props.modal.get('actions').forEach(function(action) {
      var actionRow = {
        text: polyglot.t(action.get('textKey')),
      };

      if (action.get('triggerOK')) {
        actionRow.onTouchTap = self.onClickOK.bind(self, action.get('triggerName'));
      }

      actions.push(actionRow);
    });

    var title = null;

    if (this.props.modal.get('title')) {
      title = <div style={styles.title}>
        {polyglot.t(this.props.modal.get('title'))}
      </div>;
    }

    var description = null;

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
