'use strict';

var React = require('react');

require('./style.less');

var AvatarView = React.createClass({
  propTypes: {
    contacts: React.PropTypes.array.isRequired,
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
    var contact = this.props.contacts[0];
    var child;

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
