'use strict';

var React = require('react');
var mui = require('material-ui');
var Paper = mui.Paper;

var Item = React.createClass({
  render: function() {
    return <Paper zDepth={1} className="item">
      <div>{this.props.image}</div>
      <div>{this.props.title}</div>
      <div>{this.props.description}</div>
      <div>{this.props.amount}</div>
    </Paper>;
  }
});

module.exports = Item;