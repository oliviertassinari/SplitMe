'use strict';

var React = require('react/addons');
var StylePropable = require('material-ui/lib/mixins/style-propable');

var utils = require('../utils');

var Avatar = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    StylePropable,
  ],
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
  getStyles: function() {
    var size = '40px';

    return {
      root: {
        marginTop: '-8px',
        marginBottom: '-8px',
        borderRadius: '50%',
        width: size,
        height: size,
      },
      img: {
        borderRadius: '50%',
        width: size,
        height: size,
      },
      name: {
        lineHeight: '42px',
        textAlign: 'center',
        color: '#fff',
        fontSize: '22px',
        fontWeight: '300',
      },
    };
  },
  render: function() {
    var styles = this.getStyles();
    var style;
    var child;
    var contact;

    if (this.props.contacts) {
      contact = this.props.contacts[1]; // Index 0 is always me
    } else if (this.props.contact) {
      contact = this.props.contact;
    } else {
      console.warn('missing contact');
    }

    if (contact.photos && contact.photos[0]) {
      style = styles.root;
      child = <img src={contact.photos[0].value} style={this.mergeAndPrefix(styles.img)} />;
    } else {
      var displayName = utils.getDisplayName(contact);

      style = this.mergeAndPrefix(styles.root, styles.name, {
        backgroundColor: this.stringToColour(displayName)
      });
      child = displayName.charAt(0).toUpperCase();
    }

    return <div style={style}>
      {child}
    </div>;
  },
});

module.exports = Avatar;
