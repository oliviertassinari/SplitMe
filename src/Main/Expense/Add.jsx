'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const Immutable = require('immutable');
const EventListener = require('react-event-listener');
const {connect} = require('react-redux');

const polyglot = require('polyglot');
const BottomButton = require('Main/BottomButton');
const CanvasHead = require('Main/Canvas/Head');
const CanvasBody = require('Main/Canvas/Body');
const modalActions = require('Main/Modal/actions');
const expenseActions = require('Main/Expense/actions');
const ExpenseDetail = require('Main/Expense/Detail');
const ExpenseAddHeader = require('Main/Expense/AddHeader');

const ExpenseAdd = React.createClass({
  propTypes: {
    account: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    accounts: React.PropTypes.instanceOf(Immutable.List).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    expense: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    pageDialog: React.PropTypes.string.isRequired,
  },
  mixins: [
    EventListener,
    PureRenderMixin,
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

    setTimeout(() => {
      this.props.dispatch(expenseActions.close());
    }, 0);
  },
  onTouchTapSave: function(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(expenseActions.tapSave());
    }, 0);
  },
  onTouchTapDelete: function() {
    this.props.dispatch(modalActions.show(
      [
        { textKey: 'cancel' },
        { textKey: 'delete', onTouchTap: this.onTouchTapDeleteConfirm },
      ],
      'expense_confirm_delete'
    ));
  },
  onTouchTapDeleteConfirm: function() {
    this.props.dispatch(expenseActions.deleteCurrent());
  },
  render: function() {
    const {
      account,
      accounts,
      expense,
      pageDialog,
    } = this.props;

    let title;
    let bottom;
    let style;

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
          <ExpenseDetail account={account} accounts={accounts}
            expense={expense} pageDialog={pageDialog} />
        </CanvasBody>
        {bottom}
      </div>;
  },
});

module.exports = connect()(ExpenseAdd);
