import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import colors from 'material-ui/lib/styles/colors';

const styles = {
  root: {
    fontSize: 14,
    color: colors.lightBlack,
    margin: 16,
    fontWeight: 500,
  },
};

const ListSubheader = React.createClass({
  propTypes: {
    subheader: React.PropTypes.string.isRequired,
  },
  mixins: [
    PureRenderMixin,
  ],
  render() {
    return (
      <div style={styles.root} data-test="ListSubheader">
        {this.props.subheader}
      </div>
    );
  },
});

export default ListSubheader;
