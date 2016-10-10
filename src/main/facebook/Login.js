// @flow weak

import React, { PropTypes, Component } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { createStyleSheet } from 'stylishly/lib/styleSheet';
import { grey600 } from 'material-ui-build/src/styles/colors';
import ListItem from 'material-ui-build/src/List/ListItem';
import { connect } from 'react-redux';
import polyglot from 'polyglot';
import facebookActions from 'main/facebook/actions';

const styleSheet = createStyleSheet('FacebookLogin', () => ({
  facebookEmail: {
    color: grey600,
  },
}));

class FacebookLogin extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    facebook: ImmutablePropTypes.map.isRequired,
  };

  static contextTypes = {
    styleManager: PropTypes.object.isRequired,
  };

  handleTouchTapLogin = () => {
    this.props.dispatch(facebookActions.login());
  };

  render() {
    const facebook = this.props.facebook;

    if (facebook.get('status') === 'connected') {
      let email;

      if (facebook.get('me')) {
        const classes = this.context.styleManager.render(styleSheet);

        email = (
          <div className={classes.facebookEmail}>
            {`(${facebook.getIn(['me', 'email'])})`}
          </div>
        );
      }

      return (
        <ListItem disabled>
          <div>{polyglot.t('facebook_you_are_logged')}</div>
          {email}
        </ListItem>
      );
    }

    return (
      <ListItem onTouchTap={this.handleTouchTapLogin}>
        {polyglot.t('facebook_login')}
      </ListItem>
    );
  }
}

export default compose(
  pure,
  connect((state) => {
    return {
      facebook: state.get('facebook'),
    };
  }),
)(FacebookLogin);
