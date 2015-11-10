import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const CanvasDialog = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
    show: React.PropTypes.bool.isRequired,
  },
  mixins: [
    PureRenderMixin,
  ],
  componentDidUpdate(prevProps) {
    const show = this.props.show;

    if (prevProps.show !== show) {
      const dialog = this.refs.dialog;

      // Prevent nested action trigger
      setTimeout(() => {
        if (show) {
          dialog.show();
        } else {
          dialog.dismiss();
        }
      }, 0);
    }
  },
  render() {
    return React.cloneElement(this.props.children, {
      ref: 'dialog',
      openImmediately: this.props.show,
    });
  },
});

export default CanvasDialog;
