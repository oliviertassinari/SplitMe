'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const FloatingActionButton = require('material-ui/lib/floating-action-button');
const IconAdd = require('material-ui/lib/svg-icons/content/add');

const styles = {
  root: {
    position: 'fixed',
    bottom: 24,
    right: 24,
  },
};

const MainActionButton = React.createClass({
  propTypes: {
    onTouchTap: React.PropTypes.func,
  },
  mixins: [
    PureRenderMixin,
  ],
  render: function() {
    return <FloatingActionButton onTouchTap={this.props.onTouchTap} style={styles.root}
      className="testMainActionButton">
        <IconAdd />
      </FloatingActionButton>;
  },
});

module.exports = MainActionButton;
