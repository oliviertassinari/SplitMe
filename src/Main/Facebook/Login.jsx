'use strict';

const React = require('react');
const Immutable = require('immutable');
const colors = require('material-ui/lib/styles/colors');
const ListItem = require('material-ui/lib/lists/list-item');
const {connect} = require('react-redux');

const polyglot = require('polyglot');
const facebookActions = require('Main/Facebook/actions');

const styles = {
  root: {
    minHeight: 32,
  },
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
    React.addons.PureRenderMixin,
  ],
  onTouchTapLogin: function() {
    this.props.dispatch(facebookActions.login());
  },
  render: function() {
    const facebook = this.props.facebook;

    if (facebook.get('status') === 'connected') {
      let email;

      if (facebook.get('me')) {
        email = <div style={styles.facebookEmail}>
            {'(' + facebook.getIn(['me', 'email']) + ')'}
          </div>;
      }

      return <ListItem disabled={true}>
          <div style={styles.root}>
            <div>{polyglot.t('facebook_you_are_logged')}</div>
            {email}
          </div>
        </ListItem>;
    } else {
      return <ListItem onTouchTap={this.onTouchTapLogin}>
          {polyglot.t('facebook_login')}
        </ListItem>;
    }
  },
});

module.exports = connect()(FacebookLogin);
