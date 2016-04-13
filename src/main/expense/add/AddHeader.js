import React from 'react';
import pure from 'recompose/pure';
import AppBar from 'material-ui-build/src/AppBar';
import FlatButton from 'material-ui-build/src/FlatButton';
import IconButton from 'material-ui-build/src/IconButton';
import IconClose from 'material-ui-build/src/svg-icons/navigation/close';

import polyglot from 'polyglot';

const ExpenseAddHeader = (props) => {
  const {
    onTouchTapClose,
    onTouchTapSave,
    showTapSave,
    title,
  } = props;

  const appBarLeft = (
    <IconButton onTouchTap={onTouchTapClose}>
      <IconClose />
    </IconButton>
  );

  let appBarRight;

  if (showTapSave) {
    appBarRight = (
      <FlatButton
        label={polyglot.t('save')}
        onTouchTap={onTouchTapSave}
        data-test="ExpenseSave"
      />
    );
  }

  return (
    <AppBar
      title={title}
      iconElementLeft={appBarLeft}
      iconElementRight={appBarRight}
      data-test="AppBar"
    />
  );
};

ExpenseAddHeader.propTypes = {
  onTouchTapClose: React.PropTypes.func.isRequired,
  onTouchTapSave: React.PropTypes.func.isRequired,
  showTapSave: React.PropTypes.bool.isRequired,
  title: React.PropTypes.string.isRequired,
};

export default pure(ExpenseAddHeader);
