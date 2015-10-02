'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const FloatingActionButton = require('material-ui/src/floating-action-button');
const Transitions = require('material-ui/src/styles/transitions');
const IconAdd = require('material-ui/src/svg-icons/content/add');

const styles = {
  root: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    transform: 'translate3d(0, 0, 0)',
    transition: Transitions.easeOut('400ms', 'transform'),
  },
  rootSnackbarShow: {
    transform: 'translate3d(0, -46px, 0)',
  },
};

const MainActionButton = React.createClass({
  propTypes: {
    onTouchTap: React.PropTypes.func,
    snackbarShow: React.PropTypes.bool.isRequired,
  },
  mixins: [
    PureRenderMixin,
  ],
  render: function() {
    const {
      onTouchTap,
      snackbarShow,
    } = this.props;

    let style = styles.root;

    if (snackbarShow) {
      style = Object.assign({}, style, styles.rootSnackbarShow);
    }

    return <FloatingActionButton onTouchTap={onTouchTap} style={style} className="testMainActionButton">
          <IconAdd />
        </FloatingActionButton>;
  },
});

module.exports = MainActionButton;
