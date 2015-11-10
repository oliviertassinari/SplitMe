import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import EventListener from 'react-event-listener';
import {connect} from 'react-redux';
import AppBar from 'material-ui/lib/app-bar';
import Paper from 'material-ui/lib/paper';
import IconButton from 'material-ui/lib/icon-button';
import IconClose from 'material-ui/lib/svg-icons/navigation/close';
import ListItem from 'material-ui/lib/lists/list-item';
import Dialog from 'material-ui/lib/dialog';
import CircularProgress from 'material-ui/lib/circular-progress';
import TextField from 'material-ui/lib/text-field';
import {pushState} from 'redux-router';
import DocumentTitle from 'react-document-title';

import polyglot from 'polyglot';
import CanvasHead from 'Main/Canvas/Head';
import CanvasBody from 'Main/Canvas/Body';
import screenActions from 'Main/Screen/actions';
import FacebookLogin from 'Main/Facebook/Login';
import couchdbActions from 'Main/CouchDB/actions';
import CanvasDialog from 'Main/Canvas/Dialog';

const ROWS_MAX = 4;

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
  onBackButton() {
    this.props.dispatch(screenActions.navigateBack(pushState(null, '/')));
  },
  onTouchTapClose(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(pushState(null, '/'));
    }, 0);
  },
  onTouchTapExport(event) {
    event.preventDefault();
    this.props.dispatch(couchdbActions.tapExport());
  },
  onTouchTapImport(event) {
    event.preventDefault();
    this.props.dispatch(couchdbActions.tapImport());
  },
  onDismiss() {
    if (this.props.pageDialog === 'export' || this.props.pageDialog === 'import') {
      this.props.dispatch(screenActions.dismissDialog());
    }
  },
  onTouchTapImportStart() {
    this.props.dispatch(couchdbActions.tapImportStart(this.refs.import.getValue()));
  },
  render() {
    const appBarLeft = (
      <IconButton onTouchTap={this.onTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    const couchdbExport = this.props.couchdb.get('export');
    const couchdbImport = this.props.couchdb.get('import');

    const exportActions = [
      {text: polyglot.t('ok')},
    ];

    const importActions = [
      {text: polyglot.t('cancel')},
    ];

    if (couchdbImport === 'idle') {
      importActions.push({text: polyglot.t('ok'), onTouchTap: this.onTouchTapImportStart});
    }

    return (
      <div>
        {PLATFORM === 'browser' && <DocumentTitle title={polyglot.t('settings')} />}
        <CanvasHead>
          <AppBar title={polyglot.t('settings')}
            iconElementLeft={appBarLeft} data-test="AppBar"
            onLeftIconButtonTouchTap={this.onTouchTapClose} />
        </CanvasHead>
        <CanvasBody>
          <Paper rounded={false}>
            <ListItem disabled={true}>
              {polyglot.t('version') + ' ' + VERSION}
            </ListItem>
            <FacebookLogin facebook={this.props.facebook} />
            <ListItem onTouchTap={this.onTouchTapExport} data-test="SettingsExport">
              {polyglot.t('export')}
            </ListItem>
            <ListItem onTouchTap={this.onTouchTapImport} data-test="SettingsImport">
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
              <TextField multiLine={true} rowsMax={ROWS_MAX} defaultValue={couchdbExport}
                fullWidth={true} floatingLabelText={polyglot.t('data')}
                data-test="SettingsExportTextarea" />
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
                <TextField ref="import" multiLine={true} rowsMax={ROWS_MAX}
                  fullWidth={true} floatingLabelText={polyglot.t('data')}
                  data-test="SettingsImportTextarea" />
              </div>
            }
          </Dialog>
        </CanvasDialog>
      </div>
    );
  },
});

function mapStateToProps(state) {
  return {
    facebook: state.get('facebook'),
    pageDialog: state.getIn(['screen', 'dialog']),
    couchdb: state.get('couchdb'),
  };
}

export default connect(mapStateToProps)(Settings);
