// @flow weak

import { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import settingsActions from 'main/settings/actions';

class SettingsExport extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(settingsActions.tapExport());
  }

  render() {
    return null;
  }
}

export default connect()(SettingsExport);
