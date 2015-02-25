'use strict';

var React = require('react');
var mui = require('material-ui');
var AppCanvas = mui.AppCanvas;
var AppBar = mui.AppBar;
var FloatingActionButton = mui.FloatingActionButton;
var DropDownIcon = mui.DropDownIcon;

var Backbone = require('backbone');
var BackboneMixin = require('backbone-react-component');

var Item = require('./Item.jsx');

var AccountCollectionView = React.createClass({
  mixins: [BackboneMixin],
  createModelView: function (model) {
    console.log(model.name);
    return <Item image="image" title="{model.name}" description="description" amount={3}/>;
  },
  render: function () {
    return <div>{this.state.collection.map(this.createModelView)}</div>;
  }
});

var AccountCollection = require('../src/AccountCollection');
var accountCollection = new AccountCollection();

React.render(
  <AppCanvas predefinedLayout={1}>
    <AppBar title="Split" showMenuIconButton={false}>
    </AppBar>
    <div className="mui-app-content-canvas">
      <AccountCollectionView collection={accountCollection} />
      <div id="main-button">
        <FloatingActionButton iconClassName="md-add" secondary={true}/>
      </div>
    </div>
  </AppCanvas>,
  document.body
);

accountCollection.fetch({
  success: function(collection, response) {
    console.log(collection.length);
  }
});

// var AccountModel = require('../src/AccountModel');
// var accountModel = new AccountModel({
//   name: 'test1',
//   lastExpense: '2014-02-28',
// });

// accountModel.save();
