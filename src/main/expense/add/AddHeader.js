import React from 'react';
import pure from 'recompose/pure';
import AppBar from 'material-ui/src/app-bar';
import FlatButton from 'material-ui/src/flat-button';
import IconButton from 'material-ui/src/icon-button';
import IconClose from 'material-ui/src/svg-icons/navigation/close';

import polyglot from 'polyglot';

const ExpenseAddHeader = (props) => {
  const {
    onTouchTapClose,
    onTouchTapSave,
    title,
  } = props;

  const appBarLeft = (
    <IconButton onTouchTap={onTouchTapClose}>
      <IconClose />
    </IconButton>
  );

  const appBarRight = (
    <FlatButton
      label={polyglot.t('save')}
      onTouchTap={onTouchTapSave}
      data-test="ExpenseSave"
    />
  );

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
  onTouchTapClose: React.PropTypes.func,
  onTouchTapSave: React.PropTypes.func,
  title: React.PropTypes.string.isRequired,
};

export default pure(ExpenseAddHeader);
