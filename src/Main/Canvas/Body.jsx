import React from 'react';
import pure from 'recompose/pure';

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

export default pure(CanvasBody);
