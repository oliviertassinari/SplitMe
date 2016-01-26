import React from 'react';
import pure from 'recompose/pure';

const styles = {
  root: {
    width: '100%',
    position: 'fixed',
    zIndex: 10,
  },
};

class CanvasHeader extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        {this.props.children}
      </div>
    );
  }
}

CanvasHeader.propTypes = {
  children: React.PropTypes.node,
};

export default pure(CanvasHeader);
