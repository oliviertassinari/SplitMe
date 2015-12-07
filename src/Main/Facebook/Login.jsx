import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import colors from 'material-ui/lib/styles/colors';
import ListItem from 'material-ui/lib/lists/list-item';
import {connect} from 'react-redux';

import polyglot from 'polyglot';
import facebookActions from 'Main/Facebook/actions';

const styles = {
  facebookEmail: {
    color: colors.grey600,
  },
};

const FacebookLogin = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    facebook: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  },
  mixins: [
    PureRenderMixin,
  ],
  handleTouchTapLogin() {
    this.props.dispatch(facebookActions.login());
  },
  render() {
    const facebook = this.props.facebook;

    if (facebook.get('status') === 'connected') {
      let email;

      if (facebook.get('me')) {
        email = (
          <div style={styles.facebookEmail}>
            {'(' + facebook.getIn(['me', 'email']) + ')'}
          </div>
        );
      }

      return (
        <ListItem disabled={true}>
          <div>{polyglot.t('facebook_you_are_logged')}</div>
          {email}
        </ListItem>
      );
    } else {
      return (
        <ListItem onTouchTap={this.handleTouchTapLogin}>
          {polyglot.t('facebook_login')}
        </ListItem>
      );
    }
  },
});

export default connect()(FacebookLogin);
