'use strict';

var React = require('react');
var FloatingActionButton = require('material-ui/lib/floating-action-button');

var MainActionButton = React.createClass({
  propTypes: {
    onTouchTap: React.PropTypes.func,
  },
  getStyle: function() {
    return {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
    };
  },
  render: function() {
    return <FloatingActionButton iconClassName="md-add" secondary={true}
      onTouchTap={this.props.onTouchTap} style={this.getStyle()} />;
  },
});

module.exports = MainActionButton;
