'use strict';

var React = require('react');

var CanvasDialog = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
    show: React.PropTypes.bool.isRequired,
  },
  shouldComponentUpdate: function(nextProps) {
    if (this.props.show !== nextProps.show) { // This will failed here most of the time
      return true;
    }

    return false;
  },
  // We receive != show
  componentDidUpdate: function() {
    var dialog = this.refs.dialog;
    var show = this.props.show;

    // Prevent nested action trigger
    setTimeout(function() {
      if (show) {
        dialog.show();
      } else {
        dialog.dismiss();
      }
    }, 0);
  },
  render: function() {
    return React.cloneElement(this.props.children, {
      ref: 'dialog',
    });
  },
});

module.exports = CanvasDialog;
