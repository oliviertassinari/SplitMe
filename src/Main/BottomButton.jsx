'use strict';

var React = require('react');
var FlatButton = require('material-ui/lib/flat-button');
var colors = require('material-ui/lib/styles/colors');

var polyglot = require('../polyglot');

var BottomButton = React.createClass({
  propTypes: {
    onTouchTap: React.PropTypes.func,
  },
  getStyles: function() {
    return {
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
        height: '50px',
        color: colors.grey600,
      },
    };
  },
  render: function() {
    var styles = this.getStyles();

    return <div style={styles.root}>
        <FlatButton label={polyglot.t('delete')} onTouchTap={this.props.onTouchTap} style={styles.button} />
      </div>;
  },
});

module.exports = BottomButton;
