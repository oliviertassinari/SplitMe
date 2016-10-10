// @flow weak

import React, {PropTypes, Component} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import {connect} from 'react-redux';
import {createStyleSheet} from 'stylishly/lib/styleSheet';
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
import ViewContainer from 'modules/components/ViewContainer';
import LayoutAppBar from 'modules/components/LayoutAppBar';
import LayoutBody from 'modules/components/LayoutBody';
import FacebookLogin from 'main/facebook/Login';
import settingsActions from 'main/settings/actions';
import LinkExternal from 'modules/components/LinkExternal';
import routerActions from 'main/routerActions';

const ROWS_MAX = 4;

const styleSheet = createStyleSheet('Settings', () => ({
  progress: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 144,
  },
  configName: {
    color: grey600,
    fontSize: 14,
  },
}));

const styles = {
  dialogBody: {
    marginTop: -15,
    paddingBottom: 10,
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

  static contextTypes = {
    styleManager: PropTypes.object.isRequired,
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
    const classes = this.context.styleManager.render(styleSheet);

    const {
      children,
      dataExport,
      dataImport,
      location,
    } = this.props;

    const appBarLeft = (
      <IconButton onTouchTap={this.handleTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    const exportActions = (
      <FlatButton
        label={polyglot.t('ok')}
        primary
        onTouchTap={this.handleRequestClose}
      />
    );

    const importActions = [
      <FlatButton
        key="cancel"
        label={polyglot.t('cancel')}
        primary
        onTouchTap={this.handleRequestClose}
      />,
    ];

    if (dataImport.get('status') === 'idle') {
      importActions.push(
        <FlatButton
          key="ok"
          label={polyglot.t('ok')}
          primary
          onTouchTap={this.handleTouchTapImportStart}
          data-test="SettingsImportDialogOk"
        />
      );
    }

    return (
      <ViewContainer>
        {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') && (
          <DocumentTitle title={polyglot.t('settings')} />
        )}
        <LayoutAppBar title={polyglot.t('settings')} iconElementLeft={appBarLeft} />
        <LayoutBody>
          <Paper rounded={false}>
            <LinkExternal>
              <ListItem href={constant.PRODUCTPAINS_URL}>
                {polyglot.t('settings_feedback')}
              </ListItem>
            </LinkExternal>
            <ListItem disabled>
              {`${polyglot.t('version')} ${String(process.env.VERSION)}`}
              <span className={classes.configName}>
                {` (${config.name})`}
              </span>
            </ListItem>
            <FacebookLogin />
            <ListItem onTouchTap={this.handleTouchTapExport} data-test="SettingsExport">
              {polyglot.t('export')}
            </ListItem>
            <ListItem onTouchTap={this.handleTouchTapImport} data-test="SettingsImport">
              {polyglot.t('import')}
            </ListItem>
          </Paper>
        </LayoutBody>
        <Dialog
          title={polyglot.t('export')}
          onRequestClose={this.handleRequestClose}
          actions={exportActions}
          bodyStyle={styles.dialogBody}
          open={location.pathname === '/settings/export'}
        >
          {dataExport.get('status') === 'progress' ? (
            <div className={classes.progress}>
              <CircularProgress />
            </div>
          ) : (
            <TextField
              multiLine
              rowsMax={ROWS_MAX}
              defaultValue={dataExport.get('payload')}
              fullWidth
              floatingLabelText={polyglot.t('data')}
              data-test="SettingsExportTextarea"
            />
          )}
        </Dialog>
        <Dialog
          title={polyglot.t('import')}
          onRequestClose={this.handleRequestClose}
          actions={importActions}
          bodyStyle={styles.dialogBody}
          open={location.pathname === '/settings/import'}
        >
          {dataImport.get('status') === 'progress' ? (
            <div className={classes.progress}>
              <CircularProgress />
            </div>
          ) : (
            <div>
              <TextField
                ref="import"
                multiLine
                rowsMax={ROWS_MAX}
                fullWidth
                floatingLabelText={polyglot.t('data')}
                data-test="SettingsImportTextarea"
              />
            </div>
          )}
        </Dialog>
        {children}
      </ViewContainer>
    );
  }
}

export default compose(
  pure,
  connect((state) => {
    return {
      dataImport: state.getIn(['settings', 'dataImport']),
      dataExport: state.getIn(['settings', 'dataExport']),
    };
  }),
)(Settings);
