'use strict';

var React = require('react');

var Item = React.createClass({
  render: function() {
    return <div>
      <div>{this.props.image}</div>
      <div>{this.props.title}</div>
      <div>{this.props.description}</div>
      <div>{this.props.amount}</div>
    </div>;
  }
});

module.exports = Item;