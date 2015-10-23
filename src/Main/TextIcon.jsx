'use strict';

const React = require('react');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Colors = require('material-ui/src/styles/colors');

const styles = {
  root: {
    display: 'flex',
    color: Colors.grey500,
    fontSize: 21,
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 25,
    textAlign: 'center',
  },
  icon: {
    width: '35%',
    maxWidth: 150,
    marginBottom: 30,
    display: 'block',
  },
};

const TextIcon = React.createClass({
  propTypes: {
    icon: React.PropTypes.string,
    text: React.PropTypes.string,
  },
  mixins: [
    PureRenderMixin,
  ],
  render() {
    const {
      text,
      icon,
    } = this.props;

    return (
      <div style={styles.root}>
        <img src={icon} style={styles.icon} />
        {text}
      </div>
    );
  },
});

module.exports = TextIcon;
