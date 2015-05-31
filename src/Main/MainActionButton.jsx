'use strict';

var React = require('react');
var FloatingActionButton = require('material-ui/lib/floating-action-button');

var styles = {
  root: {
    position: 'fixed',
    bottom: 24,
    right: 24,
  }
};

var MainActionButton = React.createClass({
  propTypes: {
    onTouchTap: React.PropTypes.func,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  render: function() {
    return <FloatingActionButton iconClassName="md-add"
      onTouchTap={this.props.onTouchTap} style={styles.root} className="testMainActionButton" />;
  },
});

module.exports = MainActionButton;
