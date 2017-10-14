
import React, { PropTypes } from 'react';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import { createStyleSheet } from 'jss-theme-reactor';
import Button from 'material-ui-build-next/src/Button';
import { grey } from 'material-ui-build-next/src/styles/colors';
import withStyles from 'material-ui-build-next/src/styles/withStyles';
import polyglot from 'polyglot';

const styleSheet = createStyleSheet('BottomButton', () => ({
  root: {
    flex: '0 0 auto',
    position: 'relative',
    textAlign: 'center',
    background: '#fff',
    borderTop: '1px solid #ccc',
  },
  button: {
    width: '100%',
    height: 50,
    color: grey[600],
  },
}));

const BottomButton = (props) => {
  const {
    classes,
    onClick,
  } = props;

  return (
    <div className={classes.root} data-test="BottomButton">
      <Button onClick={onClick} className={classes.button}>
        {polyglot.t('delete')}
      </Button>
    </div>
  );
};

BottomButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default compose(
  pure,
  withStyles(styleSheet),
)(BottomButton);
