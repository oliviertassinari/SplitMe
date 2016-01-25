import React from 'react';
import pure from 'recompose/pure';
import AppBar from 'material-ui/lib/app-bar';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import IconClose from 'material-ui/lib/svg-icons/navigation/close';

import polyglot from 'polyglot';

const ExpenseAddHeader = React.createClass({
  propTypes: {
    onTouchTapClose: React.PropTypes.func,
    onTouchTapSave: React.PropTypes.func,
    title: React.PropTypes.string.isRequired,
  },


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
      <FlatButton label={polyglot.t('save')}
        onTouchTap={onTouchTapSave} data-test="ExpenseSave"
      />
    );

    return (
      <AppBar title={title} iconElementLeft={appBarLeft} iconElementRight={appBarRight}
        data-test="AppBar"
      />
    );
  },
});

export default pure(ExpenseAddHeader);
