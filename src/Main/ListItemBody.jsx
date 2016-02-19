import React from 'react';
import pure from 'recompose/pure';
import {lightBlack} from 'material-ui/src/styles/colors';

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
    color: lightBlack,
  },
  right: {
    flexShrink: 0,
    wordBreak: 'break-word',
    maxWidth: '45%',
  },
};

class ListItemBody extends React.Component {
  static propTypes = {
    description: React.PropTypes.string,
    right: React.PropTypes.node,
    title: React.PropTypes.string,
  };

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
  }
}

export default pure(ListItemBody);
