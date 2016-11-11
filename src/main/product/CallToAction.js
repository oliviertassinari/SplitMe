// @flow weak

import React, { PropTypes, Component } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { createStyleSheet } from 'jss-theme-reactor';
import Button from 'material-ui-build-next/src/Button';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import polyglot from 'polyglot';
import constant from 'constant';
import withStyles from 'modules/styles/withStyles';
import analytics from 'modules/analytics/analytics';

const styleSheet = createStyleSheet('ProductCallToAction', () => ({
  buttonBig: {
    height: 42,
    fontSize: 15,
  },
  buttonAction: {
    margin: 1,
  },
}));

class ProductCallToAction extends Component {
  static propTypes = {
    accent: PropTypes.bool,
    analyticsValue: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    primary: PropTypes.bool,
    size: PropTypes.oneOf(['big', 'normal']),
  };

  static defaultProps = {
    size: 'big',
  };

  static contextTypes = {
    locale: PropTypes.string.isRequired,
  };

  state = {
    showStep2: false,
  };

  handleClickTry = () => {
    setTimeout(() => {
      this.setState({
        showStep2: true,
      });
    }, 0);
  };

  handleClickWeb = () => {
    this.props.dispatch(push('/accounts')); // Replace history?

    analytics.trackEvent('Onboarding', 'click', 'browser', this.props.analyticsValue);
  };

  handleClickAndroid = () => {
    analytics.trackEvent('Onboarding', 'click', 'android', this.props.analyticsValue);

    window.location.href = constant.APP_ANDROID_URL;
  };

  handleClickIOS = () => {
    analytics.trackEvent('Onboarding', 'click', 'ios', this.props.analyticsValue);

    window.location.href = constant.getAPP_IOS_URL(this.context.locale);
  };

  render() {
    const {
      accent,
      analyticsValue, // eslint-disable-line no-unused-vars
      classes,
      dispatch, // eslint-disable-line no-unused-vars
      primary,
      size,
      ...other
    } = this.props;

    return (
      <div {...other}>
        {!this.state.showStep2 ? (
          <Button
            raised
            primary={primary}
            accent={accent}
            className={size === 'big' ? classes.buttonBig : ''}
            onClick={this.handleClickTry}
          >
            {polyglot.t('product.try')}
          </Button>
        ) : (
        <div>
          <Button
            raised
            onClick={this.handleClickWeb}
            className={classes.buttonAction}
          >
            {polyglot.t('product.web')}
          </Button>
          <Button
            raised
            onClick={this.handleClickAndroid}
            className={classes.buttonAction}
          >
            {'Android'}
          </Button>
          <Button
            raised
            onClick={this.handleClickIOS}
            className={classes.buttonAction}
          >
            {'iOS'}
          </Button>
        </div>
        )}
      </div>
    );
  }
}

export default compose(
  pure,
  withStyles(styleSheet),
  connect(),
)(ProductCallToAction);
