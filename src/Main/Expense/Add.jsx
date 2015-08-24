'use strict';

var React = require('react');
var Immutable = require('immutable');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');
var FlatButton = require('material-ui/lib/flat-button');
var IconButton = require('material-ui/lib/icon-button');
var IconClose = require('material-ui/lib/svg-icons/navigation/close');
var EventListener = require('react-event-listener');
var connect = require('react-redux').connect;

var polyglot = require('polyglot');
var BottomButton = require('Main/BottomButton');
var modalActions = require('Main/Modal/actions');
var expenseActions = require('Main/Expense/actions');
var ExpenseDetail = require('Main/Expense/Detail');

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
  onTouchTapClose: function() {
    var dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(expenseActions.close());
    });
  },
  onTouchTapSave: function() {
    var dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(expenseActions.tapSave());
    });
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
          <ExpenseDetail account={props.account} accounts={props.accounts}
            expense={expense} pageDialog={props.pageDialog} />
        </div>
        {bottom}
      </AppCanvas>;
  },
});

module.exports = connect()(ExpenseAdd);
