import React, {PropTypes} from 'react';

const styles = {
  root: {
    width: '100%',
    position: 'fixed',
    zIndex: 10,
  },
};

const CanvasHeader = (props) => {
  return (
    <div style={styles.root}>
      {props.children}
    </div>
  );
};

CanvasHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CanvasHeader;
