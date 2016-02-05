import React from 'react';
import IconAdd from 'material-ui/src/svg-icons/content/add';
import ListItem from 'material-ui/src/lists/list-item';

import polyglot from 'polyglot';
import pluginContacts from 'plugin/contacts';

export default class MemberAdd extends React.Component {
  static propTypes = {
    onAddMember: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

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
