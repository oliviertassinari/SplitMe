// @flow weak

import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import { createStyleSheet } from 'jss-theme-reactor';
import Paper from 'material-ui-build-next/src/Paper';
import IconButton from 'material-ui-build/src/IconButton';
import IconClose from 'material-ui-build/src/svg-icons/navigation/close';
import ListItem from 'material-ui-build/src/List/ListItem';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui-build-next/src/Dialog';
import Button from 'material-ui-build-next/src/Button';
import CircularProgress from 'material-ui-build/src/CircularProgress';
import TextField from 'material-ui-build/src/TextField';
import { grey } from 'material-ui-build-next/src/styles/colors';
import polyglot from 'polyglot';
import config from 'config';
import constant from 'constant';
import ViewContainer from 'modules/components/ViewContainer';
import LayoutAppBar from 'modules/components/LayoutAppBar';
import LayoutBody from 'modules/components/LayoutBody';
import LinkExternal from 'modules/components/LinkExternal';
import withStyles from 'material-ui-build-next/src/styles/withStyles';
import FacebookLogin from 'main/facebook/Login';
import settingsActions from 'main/settings/actions';
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
    color: grey[600],
    fontSize: 14,
  },
}));

class Settings extends Component {
  static propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object.isRequired,
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

  importNode = null;

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
    this.props.dispatch(settingsActions.tapImportStart(this.importNode.getValue()));
  };

  render() {
    const {
      children,
      classes,
      dataExport,
      dataImport,
      location,
    } = this.props;

    const appBarLeft = (
      <IconButton onTouchTap={this.handleTouchTapClose}>
        <IconClose />
      </IconButton>
    );

    return (
      <ViewContainer>
        {(process.env.PLATFORM === 'browser' || process.env.PLATFORM === 'server') && (
          <DocumentTitle title={polyglot.t('settings')} />
        )}
        <LayoutAppBar title={polyglot.t('settings')} iconElementLeft={appBarLeft} />
        <LayoutBody>
          <Paper square>
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
          onRequestClose={this.handleRequestClose}
          open={location.pathname === '/settings/export'}
        >
          <DialogTitle>
            {polyglot.t('export')}
          </DialogTitle>
          <DialogContent>
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
          </DialogContent>
          <DialogActions>
            <Button primary onClick={this.handleRequestClose}>
              {polyglot.t('ok')}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          onRequestClose={this.handleRequestClose}
          open={location.pathname === '/settings/import'}
        >
          <DialogTitle>
            {polyglot.t('import')}
          </DialogTitle>
          <DialogContent>
            {dataImport.get('status') === 'progress' ? (
              <div className={classes.progress}>
                <CircularProgress />
              </div>
            ) : (
              <TextField
                ref={(node) => { this.importNode = node; }}
                multiLine
                rowsMax={ROWS_MAX}
                fullWidth
                floatingLabelText={polyglot.t('data')}
                data-test="SettingsImportTextarea"
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button primary onClick={this.handleRequestClose}>
              {polyglot.t('cancel')}
            </Button>
            <Button
              primary
              disabled={dataImport.get('status') !== 'idle'}
              onClick={this.handleTouchTapImportStart}
              data-test="SettingsImportDialogOk"
            >
              {polyglot.t('ok')}
            </Button>
          </DialogActions>
        </Dialog>
        {children}
      </ViewContainer>
    );
  }
}

export default compose(
  pure,
  withStyles(styleSheet),
  connect((state) => {
    return {
      dataImport: state.getIn(['settings', 'dataImport']),
      dataExport: state.getIn(['settings', 'dataExport']),
    };
  }),
)(Settings);
