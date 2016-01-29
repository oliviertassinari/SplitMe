import React from 'react';

const styles = {
  root: {
    paddingTop: 56,
  },
};

class CanvasBody extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    style: React.PropTypes.object,
  };

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

export default CanvasBody;
