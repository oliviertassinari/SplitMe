import React from 'react';

import Modal from 'Main/Modal/Modal';
import Snackbar from 'Main/Snackbar/Snackbar';

const Main = React.createClass({
  propTypes: {
    children: React.PropTypes.node.isRequired,
  },
  render() {
    const {
      children,
    } = this.props;

    return (
      <div>
        {children}
        <Modal />
        <Snackbar />
      </div>
    );
  },
});

export default Main;
