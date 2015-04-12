'use strict';

var React = require('react/addons');

require('./style.less');

var AvatarView = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    contact: React.PropTypes.object,
    contacts: React.PropTypes.array,
  },

  stringToColour: function(string) {
      var hash = 0;
      var i;

      for (i = 0; i < string.length; i++) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
      }

      var colour = '#';

      for (i = 0; i < 3; i++) {
          var value = (hash >> (i * 8)) & 0xFF;
          colour += ('00' + value.toString(16)).substr(-2);
      }

      return colour;
  },

  render: function() {
    var className = 'avatar';
    var style = {};
    var child;
    var contact;

    if(this.props.contacts) {
      contact = this.props.contacts[1]; // Index 0 is always me
    } else if(this.props.contact) {
      contact = this.props.contact;
    } else {
      console.warn('missing contact');
    }

    if (contact.photos && contact.photos[0]) {
      child = <img src={contact.photos[0].value} />;
    } else {
      child = contact.displayName.charAt(0).toUpperCase();
      className += ' name';
      style.backgroundColor = this.stringToColour(contact.displayName);
    }

    return <div className={className} style={style}>
      {child}
    </div>;
  },
});

module.exports = AvatarView;
