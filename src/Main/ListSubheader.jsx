'use strict';

var React = require('react');
var colors = require('material-ui/lib/styles/colors');

var styles = {
  root: {
    fontSize: 14,
    color: colors.lightBlack,
    margin: 16,
    fontWeight: 500,
  },
};

var ListSubheader = React.createClass({
  propTypes: {
    subheader: React.PropTypes.string.isRequired,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  render: function() {
    return <div style={styles.root} className="testListSubheader">
        {this.props.subheader}
      </div>;
  },
});

module.exports = ListSubheader;
