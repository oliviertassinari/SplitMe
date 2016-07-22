// @flow weak

import React, {PropTypes, Component} from 'react';
import pure from 'recompose/pure';
import RaisedButton from 'material-ui-build/src/RaisedButton';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import polyglot from 'polyglot';
import constant from 'constant';
import pluginAnalytics from 'plugin/analytics';

const styles = {
  button: {
    height: 42,
  },
  buttonLabel: {
    fontSize: 15,
  },
};

class ProductCallToAction extends Component {
  static propTypes = {
    analyticsValue: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    size: PropTypes.string,
  };

  static defaultProps = {
    primary: true,
    size: 'big',
  };

  static contextTypes = {
    locale: PropTypes.string.isRequired,
  };

  state = {
    showStep2: false,
  };

  handleTouchTapTry = () => {
    setTimeout(() => {
      this.setState({
        showStep2: true,
      });
    }, 0);
  };

  handleTouchTapWeb = () => {
    this.props.dispatch(push('/accounts')); // Replace history?

    pluginAnalytics.trackEvent('Onboarding', 'click', 'browser', this.props.analyticsValue);
  };

  handleTouchTapAndroid = () => {
    pluginAnalytics.trackEvent('Onboarding', 'click', 'android', this.props.analyticsValue);

    window.location.href = constant.APP_ANDROID_URL;
  };

  handleTouchTapIOS = () => {
    pluginAnalytics.trackEvent('Onboarding', 'click', 'ios', this.props.analyticsValue);

    window.location.href = constant.getAPP_IOS_URL(this.context.locale);
  };

  render() {
    const {
      analyticsValue, // eslint-disable-line no-unused-vars
      dispatch, // eslint-disable-line no-unused-vars
      primary,
      secondary,
      size,
      ...other,
    } = this.props;

    return (
      <div {...other}>
        {!this.state.showStep2 ?
          <RaisedButton
            primary={primary}
            secondary={secondary}
            style={(size === 'big') ? styles.button : null}
            label={polyglot.t('product.try')}
            labelStyle={(size === 'big') ? styles.buttonLabel : null}
            onTouchTap={this.handleTouchTapTry}
          /> :
          <div>
            <RaisedButton
              label={polyglot.t('product.web')}
              onTouchTap={this.handleTouchTapWeb}
            />
            <RaisedButton
              label="Android"
              onTouchTap={this.handleTouchTapAndroid}
            />
            <RaisedButton
              label="iOS"
              onTouchTap={this.handleTouchTapIOS}
            />
          </div>
        }
      </div>
    );
  }
}

export default pure(connect()(ProductCallToAction));
