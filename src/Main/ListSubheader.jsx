import React from 'react';
import pure from 'recompose/pure';
import colors from 'material-ui/src/styles/colors';

const styles = {
  root: {
    fontSize: 14,
    color: colors.lightBlack,
    margin: 16,
    fontWeight: 500,
  },
};

class ListSubheader extends React.Component {
  static propTypes = {
    subheader: React.PropTypes.string.isRequired,
  };

  render() {
    return (
      <div style={styles.root} data-test="ListSubheader">
        {this.props.subheader}
      </div>
    );
  }
}

export default pure(ListSubheader);
