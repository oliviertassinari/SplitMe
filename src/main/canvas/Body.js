import React, {PropTypes} from 'react';

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
  children: PropTypes.node,
  style: PropTypes.object,
};

export default CanvasBody;
