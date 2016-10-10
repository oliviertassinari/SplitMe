// @flow weak

import React, { PropTypes } from 'react';
import pure from 'recompose/pure';
import { createStyleSheet } from 'stylishly/lib/styleSheet';
import FlatButton from 'material-ui-build/src/FlatButton';
import { grey600 } from 'material-ui-build/src/styles/colors';
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

const BottomButton = (props, context) => {
  const classes = context.styleManager.render(styleSheet);

  return (
    <div className={classes.root} data-test="BottomButton">
      <FlatButton label={polyglot.t('delete')} onTouchTap={props.onTouchTap} style={styles.button} />
    </div>
  );
};

BottomButton.propTypes = {
  onTouchTap: PropTypes.func.isRequired,
};

BottomButton.contextTypes = {
  styleManager: PropTypes.object.isRequired,
};

export default pure(BottomButton);
