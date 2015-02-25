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

  onTouchTap: function() {
    console.log('touchtap');
  },
  createModelView: function (model) {
    return <Item onTouchTap={this.onTouchTap} key={model._id} image="image" title={model.name} description="description" amount={3}/>;
  },
  render: function () {
    return <div>{this.state.collection.map(this.createModelView)}</div>;
  }
});

var AccountCollection = require('../src/AccountCollection');
var accountCollection = new AccountCollection();

var Main = React.createClass({

  onTouchTap: function() {
    console.log('touchtap');
  },

  render: function() {
    return <AppCanvas predefinedLayout={1}>
      <AppBar title="My accounts" showMenuIconButton={false}>
      </AppBar>
      <div className="mui-app-content-canvas">
        <AccountCollectionView collection={accountCollection} />
        <div id="main-button">
          <FloatingActionButton iconClassName="md-add" secondary={true} onTouchTap={this.onTouchTap} />
        </div>
      </div>
    </AppCanvas>;
  },
});

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

React.render(<Main/>, document.body);

accountCollection.fetch({
  success: function(collection, response) {
  }
});

// var AccountModel = require('../src/AccountModel');
// var accountModel = new AccountModel({
//   name: 'test1',
//   lastExpense: '2014-02-28',
// });

// accountModel.save();
