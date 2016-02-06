import React from 'react';
import IconAdd from 'material-ui/src/svg-icons/content/add';
import ListItem from 'material-ui/src/lists/list-item';
import pure from 'recompose/pure';

import polyglot from 'polyglot';
import pluginContacts from 'plugin/contacts';

class MemberAdd extends React.Component {
  static propTypes = {
    onAddMember: React.PropTypes.func,
  };

  handleTouchTapAdd = () => {
    pluginContacts.pickContact()
      .then(this.props.onAddMember);
  };

  render() {
    return (
      <ListItem
        leftIcon={<IconAdd />}
        onTouchTap={this.handleTouchTapAdd}
        primaryText={polyglot.t('add_a_new_person')}
        data-test="MemberAdd"
      />
    );
  }
}

export default pure(MemberAdd);
