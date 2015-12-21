import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Colors from 'material-ui/lib/styles/colors';

const styles = {
  root: {
    display: 'flex',
    color: Colors.grey500,
    fontSize: 21,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 25,
    height: '70vh',
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

export default TextIcon;
