'use strict';

var React = require('react'),
  mui = require('material-ui'),
  RaisedButton = mui.RaisedButton;

var My = React.createClass({

  render: function() {
    return (
        <RaisedButton label="Default" />
    );
  }

});

React.renderComponent(
  <My />,
  document.getElementById('app')
);