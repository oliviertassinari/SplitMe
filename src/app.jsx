'use strict';

var React = require('react');
var mui = require('material-ui');
var AppCanvas = mui.AppCanvas;
var AppBar = mui.AppBar;
var FloatingActionButton = mui.FloatingActionButton;
var DropDownIcon = mui.DropDownIcon;

var Backbone = require('backbone');
var BackboneMixin = require('backbone-react-component');

console.log(Backbone);

var MyComponent = React.createClass({
  mixins: [BackboneMixin],
  render: function () {
    return <div>{this.state.foo}</div>;
  }
});

var model = new Backbone.Model({foo: 'bar'});

// Update the UI
model.set('foo', 'Hello world');

React.render(
  <AppCanvas predefinedLayout={1}>
    <AppBar title="Split" showMenuIconButton={false}>
    </AppBar>
    <div className="mui-app-content-canvas">
      <h1>Hello, world!</h1>
      <MyComponent model={model} />
      <div id="main-button">
        <FloatingActionButton iconClassName="md-add" secondary={true}/>
      </div>
    </div>
  </AppCanvas>,
  document.body
);

var PouchDB = require('pouchdb');

var db = new PouchDB('split');
db.info().then(function (info) {
  console.log(info);
});