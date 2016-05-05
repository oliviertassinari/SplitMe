import React, {PropTypes, Component} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import pure from 'recompose/pure';
import {connect} from 'react-redux';
import AppBar from 'material-ui-build/src/AppBar';
import Paper from 'material-ui-build/src/Paper';
import IconButton from 'material-ui-build/src/IconButton';
import IconClose from 'material-ui-build/src/svg-icons/navigation/close';
import ListItem from 'material-ui-build/src/List/ListItem';
import Dialog from 'material-ui-build/src/Dialog';
import CircularProgress from 'material-ui-build/src/CircularProgress';
import TextField from 'material-ui-build/src/TextField';
import {push} from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import {grey600} from 'material-ui-build/src/styles/colors';
import FlatButton from 'material-ui-build/src/FlatButton';

import polyglot from 'polyglot';
import config from 'config';
import constant from 'constant';
import CanvasHead from 'main/canvas/Head';
import CanvasBody from 'main/canvas/Body';
import FacebookLogin from 'main/facebook/Login';
import settingsActions from 'main/settings/actions';
import LinkExternal from 'main/LinkExternal';
import routerActions from 'main/routerActions';

const ROWS_MAX = 4;

const styles = {
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 144,
  },
  dialogBody: {
    marginTop: -15,
    paddingBottom: 10,
  },
  configName: {
    color: grey600,
    fontSize: 14,
  },
};

class Settings extends Component {
  static propTypes = {
    children: PropTypes.node,
    dataExport: ImmutablePropTypes.shape({
      status: PropTypes.string.isRequired,
      payload: PropTypes.string,
    }).isRequired,
    dataImport: ImmutablePropTypes.shape({
      status: PropTypes.string.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  };

  handleTouchTapClose = (event) => {
    event.preventDefault();

    setTimeout(() => {
      this.props.dispatch(routerActions.goBack('/accounts'));
    }, 0);
  };

  handleTouchTapExport = (event) => {
    event.preventDefault();
    this.props.dispatch(push('/settings/export'));
  };

  handleTouchTapImport = (event) => {
    event.preventDefault();
    this.props.dispatch(push('/settings/import'));
  };

  handleRequestClose = () => {
    this.props.dispatch(routerActions.goBack('/settings'));
  };

  handleTouchTapImportStart = () => {
    this.props.dispatch(settingsActions.tapImportStart(this.refs.import.getValue()));
  };

  render() {
    const {
      children,
      dataExport,
      dataImport,
    } = this.props;

    const appBarLeft = (
      <IconButton onTouchTap={this.handleTouchTapClose}>
        <IconClose />
      </IconButton>
    );

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

    if (dataImport.get('status') === 'idle') {
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
        <Dialog
          title={polyglot.t('export')}
          onRequestClose={this.handleRequestClose}
          actions={exportActions}
          bodyStyle={styles.dialogBody}
          open={this.props.location.pathname === '/settings/export'}
        >
          {dataExport.get('status') === 'progress' ?
            <div style={styles.progress}>
              <CircularProgress />
            </div> :
            <TextField
              multiLine={true}
              rowsMax={ROWS_MAX}
              defaultValue={dataExport.get('payload')}
              fullWidth={true}
              floatingLabelText={polyglot.t('data')}
              data-test="SettingsExportTextarea"
            />
          }
        </Dialog>
        <Dialog
          title={polyglot.t('import')}
          onRequestClose={this.handleRequestClose}
          actions={importActions}
          bodyStyle={styles.dialogBody}
          open={this.props.location.pathname === '/settings/import'}
        >
          {dataImport.get('status') === 'progress' ?
            <div style={styles.progress}>
              <CircularProgress />
            </div> :
            <div>
              <TextField
                ref="import"
                multiLine={true}
                rowsMax={ROWS_MAX}
                fullWidth={true}
                floatingLabelText={polyglot.t('data')}
                data-test="SettingsImportTextarea"
              />
            </div>
          }
        </Dialog>
        {children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataImport: state.getIn(['settings', 'dataImport']),
    dataExport: state.getIn(['settings', 'dataExport']),
  };
}

export default pure(connect(mapStateToProps)(Settings));
