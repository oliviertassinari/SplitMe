import PropTypes from 'prop-types';
import { withStyles } from 'material-ui-next/styles';

const styles = theme => ({
  '@global': {
    html: {
      background: theme.palette.background.default,
      fontFamily: theme.typography.fontFamily,
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
      '@media (max-width: 767px)': {
        userSelect: 'none',
      },
    },
    body: {
      margin: 0,
    },
  },
});

const Main = props => props.children;

Main.propTypes = {
  children: PropTypes.node.isRequired,
};

export default withStyles(styles)(Main);
