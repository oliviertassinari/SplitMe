import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import EventListener from 'react-event-listener';
import {goBack} from 'react-router-redux';

import Modal from 'main/modal/Modal';
import Snackbar from 'main/snackbar/Snackbar';
import ServiceWorker from 'main/ServiceWorker';

class MainApp extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  handleBackButton = () => {
    this.props.dispatch(goBack());
  };

  render() {
    return (
      <div>
        {this.props.children}
        <Modal />
        <Snackbar />
        <ServiceWorker />
        <EventListener target="document" onBackButton={this.handleBackButton} />
      </div>
    );
  }
}

export default connect()(MainApp);
