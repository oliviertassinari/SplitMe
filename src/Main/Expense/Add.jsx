'use strict';

var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');
var FlatButton = require('material-ui/lib/flat-button');
var EventListener = require('react-event-listener');

var polyglot = require('polyglot');
var pageStore = require('Main/pageStore');
var pageAction = require('Main/pageAction');
var BottomButton = require('Main/BottomButton');
var modalAction = require('Main/Modal/action');
var expenseAction = require('./action');
var Detail = require('./Detail');

var styles = {
  button: {
    color: '#fff',
    backgroundColor: 'transparent',
  },
  iconRight: {
    marginTop: 11,
  },
};

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
      var page = pageStore.get();
      expenseAction.navigateBack(page);
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
      title = polyglot.t('edit');
      style.paddingBottom = 50;
      bottom = <BottomButton onTouchTap={this.onTouchTapDelete} />;
    } else {
      title = polyglot.t('expense_new');
    }

    var appBarRight = <FlatButton label={polyglot.t('save')}
      onTouchTap={this.onTouchTapSave} style={styles.button} className="testExpenseSave" />;

    return <AppCanvas>
      <AppBar title={title}
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onLeftIconButtonTouchTap={this.onTouchTapClose}
        iconElementRight={appBarRight}
        iconStyleRight={styles.iconRight}
        className="testAppBar" />
      <div className="app-content-canvas" style={style}>
        <Detail expense={this.props.expense} pageDialog={this.props.pageDialog} />
      </div>
      {bottom}
    </AppCanvas>;
  }
});

module.exports = ExpenseAdd;
