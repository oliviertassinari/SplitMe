'use strict';

var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');
var FlatButton = require('material-ui/lib/flat-button');
var IconButton = require('material-ui/lib/icon-button');
var IconClose = require('material-ui/lib/svg-icons/navigation/close');
var EventListener = require('react-event-listener');

var polyglot = require('polyglot');
var pageStore = require('Main/pageStore');
var pageAction = require('Main/pageAction');
var BottomButton = require('Main/BottomButton');
var modalAction = require('Main/Modal/action');
var expenseAction = require('./action');
var Detail = require('./Detail');

var ExpenseAdd = React.createClass({
  propTypes: {
    expense: React.PropTypes.object.isRequired,
    pageDialog: React.PropTypes.string.isRequired,
  },
  mixins: [
    EventListener,
  ],
  listeners: {
    document: {
      backbutton: 'onBackButton',
    },
  },
  onBackButton: function() {
    if (pageStore.getDialog() === '') {
      var title;

      if (pageStore.get() === 'editExpense') {
        title = 'expense_confirm_delete_edit';
      } else {
        title = 'expense_confirm_delete';
      }

      modalAction.show({
        actions: [
          { textKey: 'delete', triggerOK: true, triggerName: 'closeExpenseCurrent' },
          { textKey: 'cancel' }
        ],
        title: title,
      });
    } else {
      pageAction.dismissDialog();
    }
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
    modalAction.show({
      actions: [
        { textKey: 'cancel' },
        { textKey: 'ok', triggerOK: true, triggerName: 'deleteExpenseCurrent' },
      ],
      title: 'expense_confirm_delete',
    });
  },
  render: function () {
    var expense = this.props.expense;
    var title;
    var bottom;
    var style = {};

    if (expense._id) {
      title = polyglot.t('expense_edit');
      style.paddingBottom = 50;
      bottom = <BottomButton onTouchTap={this.onTouchTapDelete} />;
    } else {
      title = polyglot.t('expense_new');
    }

    var appBarLeft = <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>;

    var appBarRight = <FlatButton label={polyglot.t('save')}
      onTouchTap={this.onTouchTapSave} className="testExpenseSave" />;

    return <AppCanvas>
      <AppBar title={title}
        iconElementLeft={appBarLeft}
        iconElementRight={appBarRight}
        className="testAppBar" />
      <div className="app-content-canvas" style={style}>
        <Detail expense={this.props.expense} pageDialog={this.props.pageDialog} />
      </div>
      {bottom}
    </AppCanvas>;
  }
});

module.exports = ExpenseAdd;
