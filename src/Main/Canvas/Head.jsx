import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const styles = {
  root: {
    width: '100%',
    position: 'fixed',
    zIndex: 10,
  },
};

const CanvasHeader = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
  },
  mixins: [
    PureRenderMixin,
  ],
  render() {
    return (
      <div style={styles.root}>
        {this.props.children}
      </div>
    );
  },
});

export default CanvasHeader;
