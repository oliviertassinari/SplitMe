'use strict';

var React = require('react');
var mui = require('material-ui');
var Paper = mui.Paper;

var Item = React.createClass({
  propTypes: {
    onTouchTap: React.PropTypes.func,
    title: React.PropTypes.string.isRequired,
  },

  onTouchTap: function(event) {
    if (this.props.onTouchTap) {
      this.props.onTouchTap(event);
    }
  },

  render: function() {
    return <Paper zDepth={1} className="item" onTouchTap={this.onTouchTap} rounded={false}>
      <div>{this.props.image}</div>
      <div>{this.props.title}</div>
      <div>{this.props.description}</div>
      <div>{this.props.amount}</div>
    </Paper>;
  }
});

module.exports = Item;
