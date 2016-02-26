import React from 'react';

const styles = {
  root: {
    width: '100%',
    position: 'fixed',
    zIndex: 10,
  },
};

class CanvasHeader extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  };

  render() {
    return (
      <div style={styles.root}>
        {this.props.children}
      </div>
    );
  }
}

export default CanvasHeader;
