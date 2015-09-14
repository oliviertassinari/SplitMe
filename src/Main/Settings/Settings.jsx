'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const Immutable = require('immutable');
const EventListener = require('react-event-listener');
const {connect} = require('react-redux');
const AppBar = require('material-ui/lib/app-bar');
const Paper = require('material-ui/lib/paper');
const IconButton = require('material-ui/lib/icon-button');
const IconClose = require('material-ui/lib/svg-icons/navigation/close');
const ListItem = require('material-ui/lib/lists/list-item');
const Dialog = require('material-ui/lib/dialog');
const CircularProgress = require('material-ui/lib/circular-progress');
const TextField = require('material-ui/lib/text-field');

const polyglot = require('polyglot');
const CanvasHead = require('Main/Canvas/Head');
const CanvasBody = require('Main/Canvas/Body');
const screenActions = require('Main/Screen/actions');
const FacebookLogin = require('Main/Facebook/Login');
const couchdbActions = require('Main/CouchDB/actions');
const CanvasDialog = require('Main/Canvas/Dialog');

const styles = {
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

const Settings = React.createClass({
  propTypes: {
    couchdb: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    facebook: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    pageDialog: React.PropTypes.string.isRequired,
  },
  mixins: [
    EventListener,
    PureRenderMixin,
  ],
  listeners: {
    document: {
      backbutton: 'onBackButton',
    },
  },
  onBackButton: function() {
    this.props.dispatch(screenActions.navigateBack(screenActions.navigateTo('home')));
  },
  onTouchTapClose: function(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(screenActions.navigateTo('home'));
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
    if (this.props.pageDialog === 'export' || this.props.pageDialog === 'import') {
      this.props.dispatch(screenActions.dismissDialog());
    }
  },
  onTouchTapImportStart: function() {
    this.props.dispatch(couchdbActions.tapImportStart(this.refs.import.getValue()));
  },
  render: function() {
    const appBarLeft = <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>;

    const couchdbExport = this.props.couchdb.get('export');
    const couchdbImport = this.props.couchdb.get('import');

    const exportActions = [
      { text: polyglot.t('ok') },
    ];

    const importActions = [
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
