'use strict';

var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var FlatButton = require('material-ui/lib/flat-button');
var IconButton = require('material-ui/lib/icon-button');
var IconClose = require('material-ui/lib/svg-icons/navigation/close');

var polyglot = require('polyglot');

var styles = {
  root: {
    position: 'absolute',
  },
};

var ExpenseAddHeader = React.createClass({
  propTypes: {
    onTouchTapClose: React.PropTypes.func,
    onTouchTapSave: React.PropTypes.func,
    title: React.PropTypes.string.isRequired,
  },

  mixins: [
    React.addons.PureRenderMixin,
  ],

  render: function() {
    var props = this.props;

    var appBarLeft = <IconButton onTouchTap={props.onTouchTapClose}>
        <IconClose />
      </IconButton>;

    var appBarRight = <FlatButton label={polyglot.t('save')}
      onTouchTap={props.onTouchTapSave} className="testExpenseSave" />;

    return <AppBar title={props.title} iconElementLeft={appBarLeft} iconElementRight={appBarRight}
        className="testAppBar" style={styles.root} />;
  },
});

module.exports = ExpenseAddHeader;
