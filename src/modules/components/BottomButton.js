// @flow weak

import React, { PropTypes } from 'react';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import { createStyleSheet } from 'jss-theme-reactor';
import FlatButton from 'material-ui-build/src/FlatButton';
import { grey600 } from 'material-ui-build/src/styles/colors';
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
}));

const styles = {
  button: {
    width: '100%',
    height: 50,
    color: grey600,
  },
};

const BottomButton = (props) => {
  const {
    classes,
    onTouchTap,
  } = props;

  return (
    <div className={classes.root} data-test="BottomButton">
      <FlatButton
        label={polyglot.t('delete')}
        onTouchTap={onTouchTap}
        style={styles.button}
      />
    </div>
  );
};

BottomButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onTouchTap: PropTypes.func.isRequired,
};

export default compose(
  pure,
  withStyles(styleSheet),
)(BottomButton);
