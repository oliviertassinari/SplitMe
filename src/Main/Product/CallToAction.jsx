import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import ActionAndroid from 'material-ui/lib/svg-icons/action/android';
import AvWeb from 'material-ui/lib/svg-icons/av/web';
import {connect} from 'react-redux';
import {routeActions} from 'redux-simple-router';

import polyglot from 'polyglot';
import constant from 'constant';
import config from 'config';

const styles = {
  button: {
    height: '42px', // px needed for material-ui
  },
  buttonLabel: {
    fontSize: 15,
  },
};

class ProductCallToAction extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleTouchTapAndroid = this.handleTouchTapAndroid.bind(this);
    this.handleTouchTapTry = this.handleTouchTapTry.bind(this);
    this.handleTouchTapWeb = this.handleTouchTapWeb.bind(this);

    this.state = {
      showStep2: false,
    };
  }

  handleTouchTapTry() {
    // Disabled for production until it's ready
    if (config.name === 'production') {
      this.handleTouchTapAndroid();
    } else {
      setTimeout(() => {
        this.setState({
          showStep2: true,
        });
      }, 0);
    }
  }

  handleTouchTapWeb() {
    this.props.dispatch(routeActions.push('/accounts')); // Replace history?
  }

  handleTouchTapAndroid() {
    window.location.href = constant.APP_ANDROID_URL;
  }

  render() {
    const {
      showStep2,
    } = this.state;

    return (
      <div>
        {!showStep2 ?
          <RaisedButton
            primary={true}
            style={styles.button}
            label={polyglot.t('product.try')}
            labelStyle={styles.buttonLabel}
            onTouchTap={this.handleTouchTapTry}
          />
        :
          <div>
            <RaisedButton
              label={polyglot.t('product.web')}
              labelPosition="after"
              onTouchTap={this.handleTouchTapWeb}
              icon={<AvWeb />}
            />
            <RaisedButton
              label="Android"
              labelPosition="after"
              onTouchTap={this.handleTouchTapAndroid}
              icon={<ActionAndroid />}
            />
          </div>
        }
      </div>
    );
  }
}

ProductCallToAction.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
};

export default connect()(ProductCallToAction);
