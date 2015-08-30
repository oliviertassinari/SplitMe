'use strict';

var React = require('react');
var Immutable = require('immutable');

var EventListener = require('react-event-listener');
var connect = require('react-redux').connect;

var polyglot = require('polyglot');
var BottomButton = require('Main/BottomButton');
var CanvasHead = require('Main/Canvas/Head');
var CanvasBody = require('Main/Canvas/Body');
var modalActions = require('Main/Modal/actions');
var expenseActions = require('Main/Expense/actions');
var ExpenseDetail = require('Main/Expense/Detail');
var ExpenseAddHeader = require('Main/Expense/AddHeader');

var ExpenseAdd = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    accounts: React.PropTypes.instanceOf(Immutable.List).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    expense: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    pageDialog: React.PropTypes.string.isRequired,
  },
  mixins: [
    EventListener,
    React.addons.PureRenderMixin,
  ],
  getInitialState: function() {
    return {
      showBottom: true,
    };
  },
  listeners: {
    document: {
      backbutton: 'onBackButton',
    },
    window: {
      'native.keyboardshow': 'onKeyBoardShow',
      'native.keyboardhide': 'onKeyBoardHide',
    },
  },
  onKeyBoardShow: function() {
    // Only apply when we edit an expense
    if (this.props.expense.get('_id')) {
      this.setState({
        showBottom: false,
      });
    }
  },
  onKeyBoardHide: function() {
    // Only apply when we edit an expense
    if (this.props.expense.get('_id')) {
      this.setState({
        showBottom: true,
      });
    }
  },
  onBackButton: function() {
    this.props.dispatch(expenseActions.navigateBack());
  },
  onTouchTapClose: function(event) {
    event.preventDefault();
    var dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(expenseActions.close());
    }, 0);
  },
  onTouchTapSave: function(event) {
    event.preventDefault();
    var dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(expenseActions.tapSave());
    }, 0);
  },
  onTouchTapDelete: function() {
    this.props.dispatch(modalActions.show(
      [
        { textKey: 'cancel' },
        { textKey: 'ok', triggerOK: true, triggerName: 'deleteExpenseCurrent' },
      ],
      'expense_confirm_delete'
    ));
  },
  render: function() {
    var props = this.props;
    var expense = props.expense;
    var title;
    var bottom;
    var style;

    if (expense.get('_id')) {
      title = polyglot.t('expense_edit');

      if (this.state.showBottom) {
        style = {
          paddingBottom: 50,
        };
        bottom = <BottomButton onTouchTap={this.onTouchTapDelete} />;
      }
    } else {
      title = polyglot.t('expense_new');
    }

    return <div>
        <CanvasHead>
          <ExpenseAddHeader title={title} onTouchTapClose={this.onTouchTapClose} onTouchTapSave={this.onTouchTapSave} />
        </CanvasHead>
        <CanvasBody style={style}>
          <ExpenseDetail account={props.account} accounts={props.accounts}
            expense={expense} pageDialog={props.pageDialog} />
        </CanvasBody>
        {bottom}
      </div>;
  },
});

module.exports = connect()(ExpenseAdd);
