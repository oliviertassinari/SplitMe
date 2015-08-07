'use strict';

var React = require('react');
var Immutable = require('immutable');
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
var store = require('Main/Expense/store');
var action = require('Main/Expense/action');
var ExpenseDetail = require('Main/Expense/Detail');

var ExpenseAdd = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    expense: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    pageDialog: React.PropTypes.string.isRequired,
  },
  mixins: [
    EventListener,
    React.addons.PureRenderMixin,
  ],
  listeners: {
    document: {
      backbutton: 'onBackButton',
    },
  },
  onBackButton: function() {
    if (this.props.pageDialog === '') {
      if (this.props.expense !== store.getOpened()) {
        var title;

        if (pageStore.get() === 'editExpense') {
          title = 'expense_confirm_delete_edit';
        } else {
          title = 'expense_confirm_delete';
        }

        modalAction.show({
            actions: [
              { textKey: 'delete', triggerOK: true, triggerName: 'closeExpenseCurrent' },
              { textKey: 'cancel' },
            ],
            title: title,
          });
      } else {
        action.close();
      }
    } else {
      pageAction.dismissDialog();
    }
  },
  onTouchTapClose: function(event) {
    event.preventDefault();
    action.close();
  },
  onTouchTapSave: function(event) {
    event.preventDefault();

    var isExpenseValide = store.isValide(this.props.expense);

    if (isExpenseValide.status) {
      action.tapSave();
    } else {
      modalAction.show({
          actions: [
            { textKey: 'ok' },
          ],
          title: isExpenseValide.message,
        });
    }
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
    var props = this.props;
    var expense = props.expense;
    var title;
    var bottom;
    var style;

    if (expense.get('_id')) {
      title = polyglot.t('expense_edit');
      style = {
        paddingBottom: 50,
      };
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
          <ExpenseDetail account={props.account} expense={expense} pageDialog={props.pageDialog} />
        </div>
        {bottom}
      </AppCanvas>;
  },
});

module.exports = ExpenseAdd;
