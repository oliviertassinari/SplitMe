'use strict';

var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');
var FlatButton = require('material-ui/lib/flat-button');

var polyglot = require('../../polyglot');
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
    modalAction.show({
      actions: [
        { textKey: 'cancel' },
        { textKey: 'ok', triggerOK: true, triggerName: 'deleteExpenseCurrent' }
      ],
      title: 'expense_confirm_delete',
    });
  },

  render: function () {
    var expense = this.props.expense;
    var title;
    var bottom;
    var className = 'app-content-canvas';

    if (expense._id) {
      title = polyglot.t('edit');
      className += ' button-bottom-padding';
      bottom = <div className="button-bottom">
        <FlatButton label={polyglot.t('delete')} onTouchTap={this.onTouchTapDelete} />
      </div>;
    } else {
      title = polyglot.t('expense_new');
    }

    var iconElementRight = <FlatButton label={polyglot.t('save')} className="expense-save" onTouchTap={this.onTouchTapSave}/>;

    return <AppCanvas predefinedLayout={1}>
      <AppBar title={title}
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onLeftIconButtonTouchTap={this.onTouchTapClose}
        iconElementRight={iconElementRight}>
      </AppBar>
      <div className={className}>
        <Detail expense={this.props.expense} pageDialog={this.props.pageDialog} />
      </div>
      {bottom}
    </AppCanvas>;
  }
});

module.exports = ExpenseAdd;
