'use strict';

var React = require('react');

var styles = {
  root: {
    width: '100%',
    position: 'fixed',
  },
};

var CanvasHeader = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
  },

  mixins: [
    React.addons.PureRenderMixin,
  ],

  render: function() {
    return <div style={styles.root}>
        {this.props.children}
      </div>;
  },
});

module.exports = CanvasHeader;
