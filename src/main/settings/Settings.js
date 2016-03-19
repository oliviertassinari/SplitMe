import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import EventListener from 'react-event-listener';
import {connect} from 'react-redux';
import AppBar from 'material-ui/src/app-bar';
import Paper from 'material-ui/src/paper';
import IconButton from 'material-ui/src/icon-button';
import IconClose from 'material-ui/src/svg-icons/navigation/close';
import ListItem from 'material-ui/src/lists/list-item';
import Dialog from 'material-ui/src/dialog';
import CircularProgress from 'material-ui/src/circular-progress';
import TextField from 'material-ui/src/text-field';
import {push} from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import {grey600} from 'material-ui/src/styles/colors';
import FlatButton from 'material-ui/src/flat-button';

import polyglot from 'polyglot';
import config from 'config';
import constant from 'constant';
import CanvasHead from 'main/canvas/Head';
import CanvasBody from 'main/canvas/Body';
import screenActions from 'main/screen/actions';
import FacebookLogin from 'main/facebook/Login';
import couchdbActions from 'main/couchDB/actions';
import LinkExternal from 'main/LinkExternal';

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
    color: grey600,
    fontSize: 14,
  },
};

class Settings extends React.Component {
  static propTypes = {
    couchdb: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    dispatch: React.PropTypes.func.isRequired,
    screenDialog: React.PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
  }

  handleBackButton = () => {
    this.props.dispatch(screenActions.navigateBack(push('/accounts')));
  };

  handleTouchTapClose = (event) => {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(push('/accounts'));
    }, 0);
  };

  handleTouchTapExport = (event) => {
    event.preventDefault();
    this.props.dispatch(couchdbActions.tapExport());
  };

  handleTouchTapImport = (event) => {
    event.preventDefault();
    this.props.dispatch(couchdbActions.tapImport());
  };

  handleRequestClose = () => {
    this.props.dispatch(screenActions.dismissDialog());
  };

  handleTouchTapImportStart = () => {
    this.props.dispatch(couchdbActions.tapImportStart(this.refs.import.getValue()));
  };

  render() {
    const {
      couchdb,
      screenDialog,
    } = this.props;

    const appBarLeft = (
      <IconButton onTouchTap={this.handleTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    const couchdbExport = couchdb.get('export');
    const couchdbImport = couchdb.get('import');

    const exportActions = (
      <FlatButton
        label={polyglot.t('ok')}
        primary={true}
        onTouchTap={this.handleRequestClose}
      />
    );

    const importActions = [
      <FlatButton
        label={polyglot.t('cancel')}
        primary={true}
        onTouchTap={this.handleRequestClose}
      />,
    ];

    if (couchdbImport === 'idle') {
      importActions.push(
        <FlatButton
          label={polyglot.t('ok')}
          primary={true}
          onTouchTap={this.handleTouchTapImportStart}
          data-test="SettingsImportDialogOk"
        />
      );
    }

    return (
      <div>
        {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') &&
          <DocumentTitle title={polyglot.t('settings')} />
        }
        <EventListener elementName="document" onBackButton={this.handleBackButton} />
        <CanvasHead>
          <AppBar
            title={polyglot.t('settings')}
            iconElementLeft={appBarLeft}
            data-test="AppBar"
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
              {`${polyglot.t('version')} ${process.env.VERSION}`}
              <span style={styles.configName}>{` (${config.name})`}</span>
            </ListItem>
            <FacebookLogin />
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
          open={screenDialog === 'export'}
        >
          {couchdbExport === null ?
            <div style={styles.progress}>
              <CircularProgress />
            </div> :
            <TextField multiLine={true} rowsMax={ROWS_MAX} defaultValue={couchdbExport}
              fullWidth={true} floatingLabelText={polyglot.t('data')}
              data-test="SettingsExportTextarea"
            />
          }
        </Dialog>
        <Dialog title={polyglot.t('import')} onRequestClose={this.handleRequestClose} actions={importActions}
          bodyStyle={styles.dialogBody}
          open={screenDialog === 'import'}
        >
          {couchdbImport === 'progress' ?
            <div style={styles.progress}>
              <CircularProgress />
            </div> :
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
  }
}

function mapStateToProps(state) {
  return {
    screenDialog: state.getIn(['screen', 'dialog']),
    couchdb: state.get('couchdb'),
  };
}

export default pure(connect(mapStateToProps)(Settings));
