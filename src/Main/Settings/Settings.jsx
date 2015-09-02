'use strict';

var React = require('react');
var Immutable = require('immutable');
var EventListener = require('react-event-listener');
var connect = require('react-redux').connect;
var AppBar = require('material-ui/lib/app-bar');
var Paper = require('material-ui/lib/paper');
var IconButton = require('material-ui/lib/icon-button');
var IconClose = require('material-ui/lib/svg-icons/navigation/close');
var ListItem = require('material-ui/lib/lists/list-item');
var Dialog = require('material-ui/lib/dialog');
var CircularProgress = require('material-ui/lib/circular-progress');
var TextField = require('material-ui/lib/text-field');

var polyglot = require('polyglot');
var CanvasHead = require('Main/Canvas/Head');
var CanvasBody = require('Main/Canvas/Body');
var screenActions = require('Main/Screen/actions');
var FacebookLogin = require('Main/Facebook/Login');
var couchdbActions = require('Main/CouchDB/actions');
var CanvasDialog = require('Main/Canvas/Dialog');

var styles = {
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 144,
  },
  dialogBody: {
    paddingTop: 0,
    paddingBottom: 0,
  },
};

var Settings = React.createClass({
  propTypes: {
    couchdb: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    facebook: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    pageDialog: React.PropTypes.string.isRequired,
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
    this.props.dispatch(screenActions.navigateBack('home'));
  },
  onTouchTapClose: function(event) {
    event.preventDefault();
    var dispatch = this.props.dispatch;

    setTimeout(function() {
      dispatch(screenActions.navigateTo('home'));
    }, 0);
  },
  onTouchTapExport: function(event) {
    event.preventDefault();
    this.props.dispatch(couchdbActions.tapExport());
  },
  onTouchTapImport: function(event) {
    event.preventDefault();
    this.props.dispatch(couchdbActions.tapImport());
  },
  onDismiss: function() {
    this.props.dispatch(screenActions.dismissDialog());
  },
  onTouchTapImportStart: function() {
    this.props.dispatch(couchdbActions.tapImportStart(this.refs.import.getValue()));
  },
  render: function() {
    var appBarLeft = <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>;

    var couchdbExport = this.props.couchdb.get('export');
    var couchdbImport = this.props.couchdb.get('import');

    var exportActions = [
      { text: polyglot.t('ok') },
    ];

    var importActions = [
      { text: polyglot.t('cancel') },
    ];

    if (couchdbImport === 'idle') {
      importActions.push({ text: polyglot.t('ok'), onTouchTap: this.onTouchTapImportStart });
    }

    return <div>
        <CanvasHead>
          <AppBar title={polyglot.t('settings')}
            iconElementLeft={appBarLeft} className="testAppBar"
            onLeftIconButtonTouchTap={this.onTouchTapClose} />
        </CanvasHead>
        <CanvasBody>
          <Paper rounded={false}>
            <ListItem disabled={true}>
              {polyglot.t('version') + ' ' + VERSION}
            </ListItem>
            <FacebookLogin facebook={this.props.facebook} />
            <ListItem onTouchTap={this.onTouchTapExport} className="testSettingsExport">
              {polyglot.t('export')}
            </ListItem>
            <ListItem onTouchTap={this.onTouchTapImport} className="testSettingsImport">
              {polyglot.t('import')}
            </ListItem>
          </Paper>
        </CanvasBody>
        <CanvasDialog show={this.props.pageDialog === 'export'}>
          <Dialog title={polyglot.t('export')} onDismiss={this.onDismiss} actions={exportActions}
            bodyStyle={styles.dialogBody} contentClassName="testSettingsExportDialog">
            {couchdbExport === null ?
              <div style={styles.progress}>
                <CircularProgress mode="indeterminate" />
              </div>
              :
              <TextField multiLine={true} rowsMax={4} defaultValue={couchdbExport}
                fullWidth={true} floatingLabelText={polyglot.t('data')}
                id="testSettingsExportTextarea" />
            }
          </Dialog>
        </CanvasDialog>
        <CanvasDialog show={this.props.pageDialog === 'import'}>
          <Dialog title={polyglot.t('import')} onDismiss={this.onDismiss} actions={importActions}
            bodyStyle={styles.dialogBody} contentClassName="testSettingsImportDialog">
            {couchdbImport === 'progress' ?
              <div style={styles.progress}>
                <CircularProgress mode="indeterminate" />
              </div>
              :
              <div>
                <TextField ref="import" multiLine={true} rowsMax={4}
                  fullWidth={true} floatingLabelText={polyglot.t('data')}
                  id="testSettingsImportTextarea" />
              </div>
            }
          </Dialog>
        </CanvasDialog>
      </div>;
  },
});

module.exports = connect()(Settings);
