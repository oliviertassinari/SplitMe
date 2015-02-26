'use strict';

var React = require('react');

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var MainView = require('./MainView');
var accountAction = require('./Account/action');

React.render(<MainView/>, document.body);

accountAction.fetchAll();