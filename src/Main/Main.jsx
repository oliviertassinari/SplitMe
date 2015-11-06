'use strict';

const React = require('react');

const Modal = require('Main/Modal/Modal');
const Snackbar = require('Main/Snackbar/Snackbar');

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

module.exports = Main;
