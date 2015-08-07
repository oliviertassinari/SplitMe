'use strict';

var React = require('react');
var Immutable = require('immutable');
var FlatButton = require('material-ui/lib/flat-button');
var colors = require('material-ui/lib/styles/colors');

var polyglot = require('polyglot');
var facebookAction = require('Main/Facebook/action');

var styles = {
  facebookEmail: {
    color: colors.grey600,
  },
};

var FacebookLogin = React.createClass({
  propTypes: {
    facebook: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  onTouchTapLogin: function() {
    facebookAction.login();
  },
  render: function() {
    var facebook = this.props.facebook;

    if (facebook.get('status') === 'connected') {
      var email;

      if (facebook.get('me')) {
        email = <div style={styles.facebookEmail}>
            {'(' + facebook.getIn(['me', 'email']) + ')'}
          </div>;
      }

      return <div>
          <div>{polyglot.t('facebook_you_are_logged')}</div>
          {email}
        </div>;
    } else {
      return <FlatButton label={polyglot.t('facebook_login')}
        onTouchTap={this.onTouchTapLogin} />;
    }
  },
});

module.exports = FacebookLogin;
