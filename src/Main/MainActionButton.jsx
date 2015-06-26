'use strict';

var React = require('react');
var FloatingActionButton = require('material-ui/lib/floating-action-button');
var IconAdd = require('material-ui/lib/svg-icons/content/add');

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
    return <FloatingActionButton
      onTouchTap={this.props.onTouchTap} style={styles.root} className="testMainActionButton">
        <IconAdd />
      </FloatingActionButton>;
  },
});

module.exports = MainActionButton;
