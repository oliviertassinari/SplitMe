import React from 'react';
import pure from 'recompose/pure';

const styles = {
  root: {
    paddingTop: 56,
  },
};

class CanvasBody extends React.Component {
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
  }
}

CanvasBody.propTypes = {
  children: React.PropTypes.node,
  style: React.PropTypes.object,
};

export default pure(CanvasBody);
