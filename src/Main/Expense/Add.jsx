'use strict';

var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var AppCanvas = require('material-ui/lib/app-canvas');
var FlatButton = require('material-ui/lib/flat-button');
var colors = require('material-ui/lib/styles/colors');

var polyglot = require('../../polyglot');
var BottomButton = require('../BottomButton');
var modalAction = require('../Modal/action');
var expenseAction = require('./action');
var Detail = require('./Detail');

var styles = {
  button: {
    color: '#fff',
    backgroundColor: 'transparent',
  },
};

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
    var style = {};

    if (expense._id) {
      title = polyglot.t('edit');
      style.paddingBottom = '50px';
      style.backgroundColor = colors.grey200;
      bottom = <BottomButton onTouchTap={this.onTouchTapDelete} />;
    } else {
      title = polyglot.t('expense_new');
    }

    var iconElementRight = <FlatButton label={polyglot.t('save')}
      onTouchTap={this.onTouchTapSave} style={styles.button} />;

    return <AppCanvas predefinedLayout={1}>
      <AppBar title={title}
        showMenuIconButton={true}
        iconClassNameLeft="md-close"
        onLeftIconButtonTouchTap={this.onTouchTapClose}
        iconElementRight={iconElementRight} />
      <div className="app-content-canvas" style={style}>
        <Detail expense={this.props.expense} pageDialog={this.props.pageDialog} />
      </div>
      {bottom}
    </AppCanvas>;
  }
});

module.exports = ExpenseAdd;
