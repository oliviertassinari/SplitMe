'use strict';

var React = require('react');
var mui = require('material-ui');
var AppBar = mui.AppBar;
var FloatingActionButton = mui.FloatingActionButton;
var FontIcon = mui.FontIcon;

React.render(
  <div>
    <h1>Hello, world!</h1>
    <FloatingActionButton iconClassName="md-add" />
    <FontIcon className="md-add"/>
  </div>,
  document.getElementById('example')
);