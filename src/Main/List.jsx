import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import StylePropable from 'material-ui/lib/mixins/style-propable';

const styles = {
  root: {
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    fontSize: 15,
  },
  rootWithoutMargin: {
    padding: '16px 0',
  },
  left: {
    width: 56,
    flexShrink: 0,
  },
  leftIcon: {
    width: 48,
    paddingLeft: 8,
    flexShrink: 0,
  },
  content: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flexGrow: 1,
  },
  right: {
    maxWidth: '45%',
    marginLeft: 16,
    flexShrink: 0,
    wordBreak: 'break-word',
  },
};

const List = React.createClass({
  propTypes: {
    left: React.PropTypes.node,
    onTouchTap: React.PropTypes.func,
    right: React.PropTypes.node,
    style: React.PropTypes.object,
    withoutMargin: React.PropTypes.bool,
  },
  mixins: [
    PureRenderMixin,
    StylePropable,
  ],
  getDefaultProps() {
    return {
      withoutMargin: false,
    };
  },
  handleTouchTap(event) {
    if (this.props.onTouchTap) {
      this.props.onTouchTap(event);
    }
  },
  render() {
    const props = this.props;
    const left = props.left;
    let leftStyle = styles.left;

    if (left && left.type.displayName === 'ContentAdd') {
      leftStyle = styles.leftIcon;
    }

    let styleRoot = this.mergeAndPrefix(styles.root, props.style);

    if (props.withoutMargin) {
      styleRoot = this.mergeAndPrefix(styleRoot, styles.rootWithoutMargin);
    }

    return (
      <div style={styleRoot} onTouchTap={this.handleTouchTap} data-test="ListItem">
        <div style={leftStyle}>{props.left}</div>
        <div style={styles.content}>
          {props.children}
        </div>
        {props.right && <div style={styles.right}>{props.right}</div>}
      </div>
    );
  },
});

export default List;
