import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconClose from 'material-ui/svg-icons/navigation/close';
import polyglot from 'polyglot';
import LayoutAppBar from 'modules/components/LayoutAppBar';

const ExpenseAddHeader = props => {
  const { onTouchTapClose, onTouchTapSave, showTapSave, title } = props;

  const appBarLeft = (
    <IconButton onTouchTap={onTouchTapClose}>
      <IconClose />
    </IconButton>
  );

  let appBarRight;

  if (showTapSave) {
    appBarRight = (
      <FlatButton label={polyglot.t('save')} onTouchTap={onTouchTapSave} data-test="ExpenseSave" />
    );
  }

  return <LayoutAppBar title={title} iconElementLeft={appBarLeft} iconElementRight={appBarRight} />;
};

ExpenseAddHeader.propTypes = {
  onTouchTapClose: PropTypes.func.isRequired,
  onTouchTapSave: PropTypes.func.isRequired,
  showTapSave: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default pure(ExpenseAddHeader);
