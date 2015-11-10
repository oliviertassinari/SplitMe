'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const FloatingActionButton = require('material-ui/lib/floating-action-button');
const Transitions = require('material-ui/lib/styles/transitions');
const IconAdd = require('material-ui/lib/svg-icons/content/add');
const {connect} = require('react-redux');

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
    isSnackbarShowed: React.PropTypes.bool.isRequired,
    onTouchTap: React.PropTypes.func,
  },
  mixins: [
    PureRenderMixin,
  ],
  render() {
    const {
      onTouchTap,
      isSnackbarShowed,
    } = this.props;

    let style = styles.root;

    if (isSnackbarShowed) {
      style = Object.assign({}, style, styles.rootSnackbarShow);
    }

    return (
      <FloatingActionButton onTouchTap={onTouchTap} style={style} data-test="MainActionButton">
        <IconAdd />
      </FloatingActionButton>
    );
  },
});

function mapStateToProps(state) {
  return {
    isSnackbarShowed: state.getIn(['snackbar', 'show']),
  };
}

module.exports = connect(mapStateToProps)(MainActionButton);
