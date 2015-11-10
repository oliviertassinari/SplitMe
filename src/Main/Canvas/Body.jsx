import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import StylePropable from 'material-ui/lib/mixins/style-propable';

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

export default CanvasBody;
