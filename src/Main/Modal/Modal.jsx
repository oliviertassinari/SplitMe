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
};

var Modal = React.createClass({
  propTypes: {
    actions: React.PropTypes.instanceOf(Immutable.List).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
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

    this.props.actions.forEach(function(action) {
      var actionRow = {
        text: polyglot.t(action.get('textKey')),
      };

      if (action.get('triggerOK')) {
        actionRow.onTouchTap = self.onClickOK.bind(self, action.get('triggerName'));
      }

      actions.push(actionRow);
    });

    var title = null;

    if (this.props.title) {
      title = <div>{polyglot.t(this.props.title)}</div>;
    }

    return <CanvasDialog show={this.props.show}>
      <Dialog actions={actions} onDismiss={this.onDismiss} contentClassName="testModal"
        bodyStyle={styles.body}>
        {title}
      </Dialog>
    </CanvasDialog>;
  },
});

module.exports = connect()(Modal);
