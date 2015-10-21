'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const colors = require('material-ui/src/styles/colors');

const styles = {
  root: {
    display: 'flex',
  },
  body: {
    flexGrow: 1,
  },
  description: {
    fontSize: 12,
    lineHeight: '20px',
    color: colors.lightBlack,
  },
  right: {
    flexShrink: 0,
    wordBreak: 'break-word',
    maxWidth: '45%',
  },
};

const ListItemBody = React.createClass({
  propTypes: {
    description: React.PropTypes.string,
    right: React.PropTypes.node,
    title: React.PropTypes.string,
  },
  mixins: [
    PureRenderMixin,
  ],
  render() {
    const {
      description,
      right,
      title,
    } = this.props;

    return (
      <div style={styles.root}>
        <div style={styles.body} data-test="ListItemBody">
          {title}
          <div style={styles.description}>
            {description}
          </div>
        </div>
        <span style={styles.right} data-test="ListItemBodyRight">
          {right}
        </span>
      </div>
    );
  },
});

module.exports = ListItemBody;
