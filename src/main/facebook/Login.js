
import React, { PropTypes, Component } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { createStyleSheet } from 'jss-theme-reactor';
import { grey } from 'material-ui-build-next/src/styles/colors';
import ListItem from 'material-ui-build/src/List/ListItem';
import { connect } from 'react-redux';
import polyglot from 'polyglot';
import withStyles from 'material-ui-build-next/src/styles/withStyles';
import facebookActions from 'main/facebook/actions';

const styleSheet = createStyleSheet('FacebookLogin', () => ({
  facebookEmail: {
    color: grey[600],
  },
}));

class FacebookLogin extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    facebook: ImmutablePropTypes.map.isRequired,
  };

  handleTouchTapLogin = () => {
    this.props.dispatch(facebookActions.login());
  };

  render() {
    const {
      classes,
      facebook,
    } = this.props;

    if (facebook.get('status') === 'connected') {
      let email;

      if (facebook.get('me')) {
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
  withStyles(styleSheet),
  connect((state) => {
    return {
      facebook: state.get('facebook'),
    };
  }),
)(FacebookLogin);
