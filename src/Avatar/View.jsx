'use strict';

var React = require('react');
var mui = require('material-ui');

var AvatarView = React.createClass({
  propTypes: {
    image: React.PropTypes.string,
    name: React.PropTypes.string,
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

    if(!this.props.image) {
      className += ' name';
      style.backgroundColor = this.stringToColour(this.props.name);
    }

    var child;

    if (this.props.image) {
      child = <img src={this.props.image} />;
    } else {
      child = this.props.name[0];
    }

    return <div className={className} style={style}>
      {child}
    </div>;
  },
});

module.exports = AvatarView;
