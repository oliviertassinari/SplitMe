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
import {push} from 'redux-router';
import DocumentTitle from 'react-document-title';
import colors from 'material-ui/lib/styles/colors';
import FlatButton from 'material-ui/lib/flat-button';

import polyglot from 'polyglot';
import config from 'config';
import constant from 'constant';
import CanvasHead from 'Main/Canvas/Head';
import CanvasBody from 'Main/Canvas/Body';
import screenActions from 'Main/Screen/actions';
import FacebookLogin from 'Main/Facebook/Login';
import couchdbActions from 'Main/CouchDB/actions';
import LinkExternal from 'Main/LinkExternal';

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
  configName: {
    color: colors.grey600,
    fontSize: 14,
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
      backbutton: 'handleBackButton',
    },
  },
  handleBackButton() {
    this.props.dispatch(screenActions.navigateBack(push('/accounts')));
  },
  handleTouchTapClose(event) {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(push('/accounts'));
    }, 0);
  },
  handleTouchTapExport(event) {
    event.preventDefault();
    this.props.dispatch(couchdbActions.tapExport());
  },
  handleTouchTapImport(event) {
    event.preventDefault();
    this.props.dispatch(couchdbActions.tapImport());
  },
  handleRequestClose() {
    this.props.dispatch(screenActions.dismissDialog());
  },
  handleTouchTapImportStart() {
    this.props.dispatch(couchdbActions.tapImportStart(this.refs.import.getValue()));
  },
  render() {
    const appBarLeft = (
      <IconButton onTouchTap={this.handleTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    const couchdbExport = this.props.couchdb.get('export');
    const couchdbImport = this.props.couchdb.get('import');

    const exportActions = (
      <FlatButton
        label={polyglot.t('ok')}
        secondary={true}
        onTouchTap={this.handleRequestClose}
      />
    );

    const importActions = [
      <FlatButton
        label={polyglot.t('cancel')}
        secondary={true}
        onTouchTap={this.handleRequestClose}
      />,
    ];

    if (couchdbImport === 'idle') {
      importActions.push(
        <FlatButton
          label={polyglot.t('ok')}
          secondary={true}
          onTouchTap={this.handleTouchTapImportStart}
          data-test="SettingsImportDialogOk"
        />
      );
    }

    return (
      <div>
        {process.env.PLATFORM === 'browser' && <DocumentTitle title={polyglot.t('settings')} />}
        <CanvasHead>
          <AppBar title={polyglot.t('settings')}
            iconElementLeft={appBarLeft} data-test="AppBar"
          />
        </CanvasHead>
        <CanvasBody>
          <Paper rounded={false}>
            <LinkExternal href={constant.PRODUCTPAINS_URL}>
              <ListItem>
                {polyglot.t('settings_feedback')}
              </ListItem>
            </LinkExternal>
            <ListItem disabled={true}>
              {polyglot.t('version') + ' ' + process.env.VERSION}
              <span style={styles.configName}>{' (' + config.name + ')'}</span>
            </ListItem>
            <FacebookLogin facebook={this.props.facebook} />
            <ListItem onTouchTap={this.handleTouchTapExport} data-test="SettingsExport">
              {polyglot.t('export')}
            </ListItem>
            <ListItem onTouchTap={this.handleTouchTapImport} data-test="SettingsImport">
              {polyglot.t('import')}
            </ListItem>
          </Paper>
        </CanvasBody>
        <Dialog title={polyglot.t('export')} onRequestClose={this.handleRequestClose} actions={exportActions}
          bodyStyle={styles.dialogBody}
          open={this.props.pageDialog === 'export'}
        >
          {couchdbExport === null ?
            <div style={styles.progress}>
              <CircularProgress mode="indeterminate" />
            </div>
            :
            <TextField multiLine={true} rowsMax={ROWS_MAX} defaultValue={couchdbExport}
              fullWidth={true} floatingLabelText={polyglot.t('data')}
              data-test="SettingsExportTextarea"
            />
          }
        </Dialog>
        <Dialog title={polyglot.t('import')} onRequestClose={this.handleRequestClose} actions={importActions}
          bodyStyle={styles.dialogBody}
          open={this.props.pageDialog === 'import'}
        >
          {couchdbImport === 'progress' ?
            <div style={styles.progress}>
              <CircularProgress mode="indeterminate" />
            </div>
            :
            <div>
              <TextField ref="import" multiLine={true} rowsMax={ROWS_MAX}
                fullWidth={true} floatingLabelText={polyglot.t('data')}
                data-test="SettingsImportTextarea"
              />
            </div>
          }
        </Dialog>
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
