'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');
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
    PureRenderMixin,
  ],

  render() {
    const props = this.props;

    const appBarLeft = (
      <IconButton onTouchTap={props.onTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    const appBarRight = (
      <FlatButton label={polyglot.t('save')}
        onTouchTap={props.onTouchTapSave} data-test="ExpenseSave" />
    );

    return (
      <AppBar title={props.title} iconElementLeft={appBarLeft} iconElementRight={appBarRight}
        data-test="AppBar" />
    );
  },
});

module.exports = ExpenseAddHeader;
