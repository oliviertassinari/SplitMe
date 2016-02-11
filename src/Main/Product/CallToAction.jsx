import React from 'react';
import pure from 'recompose/pure';
import RaisedButton from 'material-ui/src/raised-button';
import ActionAndroid from 'material-ui/src/svg-icons/action/android';
import AvWeb from 'material-ui/src/svg-icons/av/web';
import {connect} from 'react-redux';
import {routeActions} from 'redux-simple-router';

import polyglot from 'polyglot';
import constant from 'constant';
import pluginAnalytics from 'plugin/analytics';

const styles = {
  button: {
    height: '42px', // px needed for material-ui
  },
  buttonLabel: {
    fontSize: 15,
  },
};

class ProductCallToAction extends React.Component {
  static propTypes = {
    analyticsValue: React.PropTypes.number.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    primary: React.PropTypes.bool,
    secondary: React.PropTypes.bool,
    size: React.PropTypes.string,
  };

  static defaultProps = {
    primary: true,
    size: 'big',
  };

  constructor(props) {
    super(props);

    this.state = {
      showStep2: false,
    };
  }

  handleTouchTapTry = () => {
    setTimeout(() => {
      this.setState({
        showStep2: true,
      });
    }, 0);
  };

  handleTouchTapWeb = () => {
    this.props.dispatch(routeActions.push('/accounts')); // Replace history?

    pluginAnalytics.trackEvent('Onboarding', 'click', 'browser', this.props.analyticsValue);
  };

  handleTouchTapAndroid = () => {
    pluginAnalytics.trackEvent('Onboarding', 'click', 'android', this.props.analyticsValue);

    window.location.href = constant.APP_ANDROID_URL;
  };

  render() {
    const {
      showStep2,
    } = this.state;

    const {
      primary,
      secondary,
      size,
      ...others,
    } = this.props;

    return (
      <div {...others}>
        {!showStep2 ?
          <RaisedButton
            primary={primary}
            secondary={secondary}
            style={(size === 'big') ? styles.button : null}
            label={polyglot.t('product.try')}
            labelStyle={(size === 'big') ? styles.buttonLabel : null}
            onTouchTap={this.handleTouchTapTry}
          />
        :
          <div>
            <RaisedButton
              label={polyglot.t('product.web')}
              onTouchTap={this.handleTouchTapWeb}
              icon={<AvWeb />}
            />
            <RaisedButton
              label="Android"
              onTouchTap={this.handleTouchTapAndroid}
              icon={<ActionAndroid />}
            />
          </div>
        }
      </div>
    );
  }
}

export default connect()(pure(ProductCallToAction));
