import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import Transitions from 'material-ui/lib/styles/transitions';
import IconAdd from 'material-ui/lib/svg-icons/content/add';
import {connect} from 'react-redux';

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

export default connect(mapStateToProps)(MainActionButton);
