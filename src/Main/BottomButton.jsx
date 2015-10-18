'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const FlatButton = require('material-ui/src/flat-button');
const colors = require('material-ui/src/styles/colors');

const polyglot = require('polyglot');

const styles = {
  root: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    left: 0,
    textAlign: 'center',
    background: '#fff',
    borderTop: '1px solid #ccc',
  },
  button: {
    width: '100%',
    height: 50,
    color: colors.grey600,
  },
};

const BottomButton = React.createClass({
  propTypes: {
    onTouchTap: React.PropTypes.func.isRequired,
  },
  mixins: [
    PureRenderMixin,
  ],
  render() {
    return (
      <div style={styles.root} data-test="BottomButton">
        <FlatButton label={polyglot.t('delete')} onTouchTap={this.props.onTouchTap} style={styles.button} />
      </div>
    );
  },
});

module.exports = BottomButton;
