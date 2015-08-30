'use strict';

var React = require('react');
var colors = require('material-ui/lib/styles/colors');
var StylePropable = require('material-ui/lib/mixins/style-propable');

var styles = {
  root: {
    paddingTop: 56,
    background: colors.grey200,
  },
};

var CanvasBody = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
    style: React.PropTypes.object,
  },

  mixins: [
    React.addons.PureRenderMixin,
    StylePropable,
  ],

  render: function() {
    var props = this.props;

    return <div style={this.mergeAndPrefix(styles.root, props.style)}>
        {props.children}
      </div>;
  },
});

module.exports = CanvasBody;
