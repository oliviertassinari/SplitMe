'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const colors = require('material-ui/src/styles/colors');
const StylePropable = require('material-ui/src/mixins/style-propable');

const styles = {
  root: {
    paddingTop: 56,
    background: colors.grey200,
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
