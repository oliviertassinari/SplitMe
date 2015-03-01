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
    return <Paper zDepth={1} innerClassName="lists-item" onTouchTap={this.onTouchTap} rounded={false}>
      <div className="lists-item-tile-left"><img src={this.props.image}/></div>
      <div className="lists-item-tile-contente">
        {this.props.title}
        {this.props.description}
        {this.props.amount}
      </div>
    </Paper>;
  }
});

module.exports = Item;
