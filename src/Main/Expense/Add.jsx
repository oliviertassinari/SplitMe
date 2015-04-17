'use strict';

var React = require('react');
var mui = require('material-ui');
var AppBar = mui.AppBar;
var AppCanvas = mui.AppCanvas;
var FlatButton = mui.FlatButton;

var polyglot = require('../../polyglot');
var pageAction = require('../pageAction');
var modalAction = require('../Modal/action');
var expenseAction = require('./action');
var Detail = require('./Detail');

require('./add.less');

var ExpenseAdd = React.createClass({
  propTypes: {
    expense: React.PropTypes.object.isRequired,
    pageDialog: React.PropTypes.string.isRequired,
  },

  onTouchTapClose: function(event) {
    event.preventDefault();
    expenseAction.tapClose();
  },

  onTouchTapSave: function(event) {
    event.preventDefault();
    expenseAction.tapSave();
  },

  onTouchTapDelete: function() {
    modalAction.update({
      actions: [
        { textKey: 'cancel' },
        { textKey: 'ok', triggerOK: true, triggerName: 'deleteExpenseCurrent' }
      ],
      title: 'delete_expense',
    });
    pageAction.showDialog('modal');
  },

  render: function () {
    var expense = this.props.expense;
    var title;
    var bottom;
    var className = 'mui-app-content-canvas';

    if (expense._id) {
      title = polyglot.t('edit');
      className += ' button-bottom-padding';
      bottom = <div className="button-bottom">
        <FlatButton label={polyglot.t('delete')} onTouchTap={this.onTouchTapDelete} />
      </div>;
    } else {
      title = polyglot.t('new_expense');
    }

    return <AppCanvas predefinedLayout={1}>
      <AppBar title={title}
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onMenuIconButtonTouchTap={this.onTouchTapClose}>
          <FlatButton label={polyglot.t('save')} className="expense-save" onTouchTap={this.onTouchTapSave}/>
      </AppBar>
      <div className={className}>
        <Detail expense={this.props.expense} pageDialog={this.props.pageDialog} />
      </div>
      {bottom}
    </AppCanvas>;
  }
});

module.exports = ExpenseAdd;
