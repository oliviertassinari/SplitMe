import {PropTypes, Component} from 'react';
import {connect} from 'react-redux';

import settingsActions from 'main/settings/actions';

class SettingsImport extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(settingsActions.tapImport());
  }

  render() {
    return null;
  }
}

export default connect()(SettingsImport);
