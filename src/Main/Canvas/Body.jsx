import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

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
  ],
  render() {
    const {
      children,
      style,
    } = this.props;

    return (
      <div style={Object.assign({}, styles.root, style)}>
        {children}
      </div>
    );
  },
});

export default CanvasBody;
