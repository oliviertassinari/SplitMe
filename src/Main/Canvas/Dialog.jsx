'use strict';

const React = require('react');

const CanvasDialog = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
    show: React.PropTypes.bool.isRequired,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  componentDidUpdate: function(prevProps) {
    const show = this.props.show;

    if (prevProps.show !== show) {
      const dialog = this.refs.dialog;

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
      openImmediately: this.props.show,
    });
  },
});

module.exports = CanvasDialog;
