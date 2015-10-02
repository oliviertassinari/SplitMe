'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const AppBar = require('material-ui/src/app-bar');
const FlatButton = require('material-ui/src/flat-button');
const IconButton = require('material-ui/src/icon-button');
const IconClose = require('material-ui/src/svg-icons/navigation/close');

const polyglot = require('polyglot');

const ExpenseAddHeader = React.createClass({
  propTypes: {
    onTouchTapClose: React.PropTypes.func,
    onTouchTapSave: React.PropTypes.func,
    title: React.PropTypes.string.isRequired,
  },

  mixins: [
    PureRenderMixin,
  ],

  render: function() {
    const props = this.props;

    const appBarLeft = <IconButton onTouchTap={props.onTouchTapClose}>
        <IconClose />
      </IconButton>;

    const appBarRight = <FlatButton label={polyglot.t('save')}
      onTouchTap={props.onTouchTapSave} className="testExpenseSave" />;

    return <AppBar title={props.title} iconElementLeft={appBarLeft} iconElementRight={appBarRight}
      className="testAppBar" />;
  },
});

module.exports = ExpenseAddHeader;
