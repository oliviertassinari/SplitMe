import React from 'react';

const styles = {
  root: {
    paddingTop: 56,
  },
};

const CanvasBody = (props) => {
  const {
    children,
    style,
  } = props;

  return (
    <div style={Object.assign({}, styles.root, style)}>
      {children}
    </div>
  );
};

CanvasBody.propTypes = {
  children: React.PropTypes.node,
  style: React.PropTypes.object,
};

export default CanvasBody;
