import React from 'react';
import pure from 'recompose/pure';
import AppBar from 'material-ui/src/app-bar';
import FlatButton from 'material-ui/src/flat-button';
import IconButton from 'material-ui/src/icon-button';
import IconClose from 'material-ui/src/svg-icons/navigation/close';

import polyglot from 'polyglot';

class ExpenseAddHeader extends React.Component {
  static propTypes = {
    onTouchTapClose: React.PropTypes.func,
    onTouchTapSave: React.PropTypes.func,
    title: React.PropTypes.string.isRequired,
  };

  render() {
    const {
      onTouchTapClose,
      onTouchTapSave,
      title,
    } = this.props;

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
        title={title} data-test="AppBar"
        iconElementLeft={appBarLeft} iconElementRight={appBarRight}
      />
    );
  }
}

export default pure(ExpenseAddHeader);
