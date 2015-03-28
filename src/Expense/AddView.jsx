'use strict';

var React = require('react');
var mui = require('material-ui');
var AppBar = mui.AppBar;
var AppCanvas = mui.AppCanvas;
var IconButton = mui.IconButton;
var FlatButton = mui.FlatButton;

var Detail = require('./DetailView');
var action = require('./action');

var AddView = React.createClass({
  propTypes: {
    expense: React.PropTypes.object.isRequired,
    pageDialog: React.PropTypes.string.isRequired,
  },

  onTouchTapClose: function(event) {
    event.preventDefault();
    action.tapClose();
  },

  onTouchTapSave: function(event) {
    event.preventDefault();
    action.tapSave();
  },

  render: function () {
    var expense = this.props.expense;
    var title;
    var bottom;
    var className = 'mui-app-content-canvas';

    if(expense._id) {
      title = 'Edit expense';
      bottom = <div className="button-bottom">
        <FlatButton label="SUPPRIMER" />
      </div>;
      className += ' button-bottom-padding';
    } else {
      title = 'New expense';
    }

    return <AppCanvas predefinedLayout={1}>
      <AppBar title={title}
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onMenuIconButtonTouchTap={this.onTouchTapClose}>
          <FlatButton label="Save" className="expense-save" onTouchTap={this.onTouchTapSave}/>
      </AppBar>
      <div className={className}>
        <Detail expense={this.props.expense} pageDialog={this.props.pageDialog} />
      </div>
      {bottom}
    </AppCanvas>;
  }
});

module.exports = AddView;
