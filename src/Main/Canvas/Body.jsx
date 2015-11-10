'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const StylePropable = require('material-ui/lib/mixins/style-propable');

const styles = {
  root: {
    paddingTop: 56,
  },
};

const CanvasBody = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
    style: React.PropTypes.object,
  },

  mixins: [
    PureRenderMixin,
    StylePropable,
  ],

  render() {
    const {
      children,
      style,
    } = this.props;

    return (
      <div style={this.mergeAndPrefix(styles.root, style)}>
        {children}
      </div>
    );
  },
});

module.exports = CanvasBody;
