'use strict';

var React = require('react');
var _ = require('underscore');
var mui = require('material-ui');
var AppCanvas = mui.AppCanvas;
var AppBar = mui.AppBar;
var FloatingActionButton = mui.FloatingActionButton;

var Item = require('../Item/View');
var action = require('./action');

var ListView = React.createClass({
  propTypes: {
    accounts: React.PropTypes.array.isRequired,
  },

  onTouchTapItem: function() {
    action.tapItem();
  },

  onTouchTapAddExpense: function() {
    action.tapAddExpense();
  },

  render: function () {
    var self = this;

    return <AppCanvas predefinedLayout={1}>
      <AppBar title="My accounts" showMenuIconButton={false}>
      </AppBar>
      <div className="mui-app-content-canvas">
        {_.map(this.props.accounts, function (account) {
          return <Item
            onTouchTap={self.onTouchTapItem}
            key={account._id}
            image="image"
            title={account.name}
            description="description"
            amount={3}
          />;
        })}
        <div id="main-button">
          <FloatingActionButton
            iconClassName="md-add"
            secondary={true}
            onTouchTap={this.onTouchTapAddExpense} />
        </div>
      </div>
    </AppCanvas>;
  }
});

module.exports = ListView;
