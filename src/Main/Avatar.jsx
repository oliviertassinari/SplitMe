'use strict';

var React = require('react/addons');
var StylePropable = require('material-ui/lib/mixins/style-propable');

var utils = require('utils');

var Avatar = React.createClass({
  propTypes: {
    contact: React.PropTypes.object,
    contacts: React.PropTypes.array,
    size: React.PropTypes.number,
    style: React.PropTypes.object,
  },
  mixins: [
    React.addons.PureRenderMixin,
    StylePropable,
  ],
  getDefaultProps: function() {
    return {
      size: 40,
    };
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
  getStyles: function (size) {
    return {
      root: {
        marginTop: -8,
        marginBottom: -8,
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
        lineHeight: (size + 2) + 'px',
        textAlign: 'center',
        color: '#fff',
        fontSize: (size + 2) / 2,
        fontWeight: 300,
      },
    };
  },
  render: function() {
    var styles = this.getStyles(this.props.size);
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

    if (contact.photo) {
      style = styles.root;
      child = <img src={contact.photo} style={this.mergeAndPrefix(styles.img)} />;
    } else {
      var displayName = utils.getDisplayName(contact);

      style = this.mergeAndPrefix(styles.root, styles.name, {
        backgroundColor: this.stringToColour(displayName)
      });
      child = displayName.charAt(0).toUpperCase();
    }

    return <div style={this.mergeAndPrefix(style, this.props.style)}>
      {child}
    </div>;
  },
});

module.exports = Avatar;
