'use strict';

var React = require('react');
var Immutable = require('immutable');
var AppBar = require('material-ui/lib/app-bar');
var Paper = require('material-ui/lib/paper');
var IconButton = require('material-ui/lib/icon-button');
var IconClose = require('material-ui/lib/svg-icons/navigation/close');
var ListItem = require('material-ui/lib/lists/list-item');
var EventListener = require('react-event-listener');
var connect = require('react-redux').connect;

var polyglot = require('polyglot');
var CanvasHead = require('Main/Canvas/Head');
var CanvasBody = require('Main/Canvas/Body');
var screenActions = require('Main/Screen/actions');
var FacebookLogin = require('Main/Facebook/Login');
var couchdbActions = require('Main/CouchDB/actions');

var Settings = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    facebook: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  },
  mixins: [
    EventListener,
    React.addons.PureRenderMixin,
  ],
  listeners: {
    document: {
      backbutton: 'onBackButton',
    },
  },
  onBackButton: function() {
    this.props.dispatch(screenActions.navigateTo('home'));
  },
  onTouchTapClose: function(event) {
    event.preventDefault();
    var dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(screenActions.navigateTo('home'));
    }, 0);
  },
  onTouchTapExport: function() {
    this.props.dispatch(couchdbActions.export());
  },
  onTouchTapImport: function() {
    this.props.dispatch(couchdbActions.import());
  },
  render: function() {
    var appBarLeft = <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>;

    return <div>
        <CanvasHead>
          <AppBar title={polyglot.t('settings')}
            iconElementLeft={appBarLeft}
            onLeftIconButtonTouchTap={this.onTouchTapClose} />
        </CanvasHead>
        <CanvasBody>
          <Paper rounded={false}>
            <ListItem disabled={true}>
              {polyglot.t('version') + ' ' + VERSION}
            </ListItem>
            <ListItem disabled={true}>
              <FacebookLogin facebook={this.props.facebook} />
            </ListItem>
            <ListItem onTouchTap={this.onTouchTapExport}>
              {polyglot.t('export')}
            </ListItem>
            <ListItem onTouchTap={this.onTouchTapImport}>
              {polyglot.t('import')}
            </ListItem>
          </Paper>
        </CanvasBody>
      </div>;
  },
});

module.exports = connect()(Settings);
