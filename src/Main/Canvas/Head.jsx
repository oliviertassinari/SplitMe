import React from 'react';
import pure from 'recompose/pure';

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
  render() {
    return (
      <div style={styles.root}>
        {this.props.children}
      </div>
    );
  },
});

export default pure(CanvasHeader);
