'use strict';

var React = require('react');

var CanvasDialog = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
    show: React.PropTypes.bool.isRequired,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  componentDidUpdate: function(prevProps) {
    var show = this.props.show;

    if (prevProps.show !== show) {
      var dialog = this.refs.dialog;

      // Prevent nested action trigger
      setTimeout(function() {
        if (show) {
          dialog.show();
        } else {
          dialog.dismiss();
        }
      }, 0);
    }
  },
  render: function() {
    return React.cloneElement(this.props.children, {
      ref: 'dialog',
    });
  },
});

module.exports = CanvasDialog;
