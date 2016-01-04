import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import ActionAndroid from 'material-ui/lib/svg-icons/action/android';
import AvWeb from 'material-ui/lib/svg-icons/av/web';
import {connect} from 'react-redux';
import {push} from 'redux-router';
import polyglot from 'polyglot';
import constant from 'constant';

const ProductCallToAction = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      showStep2: false,
    };
  },
  handleTouchTapTry() {
    if (process.env.NODE_ENV === 'production') {
      this.handleTouchTapAndroid();
    } else {
      setTimeout(() => {
        this.setState({
          showStep2: true,
        });
      }, 0);
    }
  },
  handleTouchTapWeb() {
    this.props.dispatch(push('/accounts')); // Replace history?
  },
  handleTouchTapAndroid() {
    window.location.href = constant.APP_ANDROID_URL;
  },
  render() {
    const {
      showStep2,
    } = this.state;

    return (
      <div>
        {!showStep2 ?
          <RaisedButton primary={true} label={polyglot.t('product.try')} onTouchTap={this.handleTouchTapTry} />
        :
          <div>
            <RaisedButton label={polyglot.t('product.web')} onTouchTap={this.handleTouchTapWeb}>
              <AvWeb />
            </RaisedButton>
            <RaisedButton label="Android" onTouchTap={this.handleTouchTapAndroid}>
              <ActionAndroid />
            </RaisedButton>
          </div>
        }
      </div>
    );
  },
});

export default connect()(ProductCallToAction);
