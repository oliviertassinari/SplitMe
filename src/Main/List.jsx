'use strict';

var React = require('react');
var StylePropable = require('material-ui/lib/mixins/style-propable');

var styles = {
  'root': {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
  },
  rootWithoutMargin: {
    padding: '16px 0',
  },
  'left': {
    width: '56px',
    flexShrink: 0,
  },
  'leftIcon': {
    width: '48px',
    paddingLeft: '8px',
    flexShrink: 0,
  },
  content: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flexGrow: 1,
  },
  right: {
    maxWidth: '45%',
    marginLeft: '16px',
    flexShrink: 0,
    wordBreak: 'break-word',
  },
};

var List = React.createClass({
  propTypes: {
    onTouchTap: React.PropTypes.func,
    left: React.PropTypes.node,
    right: React.PropTypes.node,
    withoutMargin: React.PropTypes.bool,
  },
  mixins: [
    StylePropable,
  ],
  getDefaultProps: function() {
    return {
      withoutMargin: false,
    };
  },
  onTouchTap: function(event) {
    if (this.props.onTouchTap) {
      this.props.onTouchTap(event);
    }
  },
  render: function() {
    var left = this.props.left;
    var leftStyle = styles.left;

    if (left && left.type.displayName === 'FontIcon') {
      leftStyle = styles.leftIcon;
    }

    var styleRoot = styles.root;

    if (this.props.withoutMargin) {
      styleRoot = this.mergeAndPrefix(styles.root, styles.rootWithoutMargin);
    }

    return <div style={styleRoot} onTouchTap={this.onTouchTap} className="testList">
      <div style={leftStyle}>{this.props.left}</div>
      <div style={styles.content}>
        {this.props.children}
      </div>
      <div style={styles.right}>{this.props.right}</div>
    </div>;
  },
});

module.exports = List;
