'use strict';

const React = require('react');
const AppBar = require('material-ui/lib/app-bar');
const FlatButton = require('material-ui/lib/flat-button');
const IconButton = require('material-ui/lib/icon-button');
const IconClose = require('material-ui/lib/svg-icons/navigation/close');

const polyglot = require('polyglot');

const ExpenseAddHeader = React.createClass({
  propTypes: {
    onTouchTapClose: React.PropTypes.func,
    onTouchTapSave: React.PropTypes.func,
    title: React.PropTypes.string.isRequired,
  },

  mixins: [
    React.addons.PureRenderMixin,
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
