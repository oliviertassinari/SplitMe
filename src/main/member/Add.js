import React from 'react';
import IconAdd from 'material-ui/src/svg-icons/content/add';
import ListItem from 'material-ui/src/lists/list-item';
import AutoComplete from 'material-ui/src/auto-complete';
import pure from 'recompose/pure';
import throttle from 'lodash.throttle';
import MenuItem from 'material-ui/src/menus/menu-item';
import MemberAvatar from 'main/member/Avatar';
import Immutable from 'immutable';

import polyglot from 'polyglot';
import MemberPlugin from 'main/member/plugin';

const styles = {
  autoComplete: {
    padding: '0 16px',
  },
  menuItem: {
    paddingTop: 4,
    paddingBottom: 3,
  },
  menuItemText: {
    marginLeft: 50,
  },
};

function filter(searchText) {
  return searchText !== '';
}

function getMemberSearchText(searchText) {
  return Immutable.fromJS({
    id: searchText,
    name: searchText,
    photo: null,
  });
}

function getMemberContact(contact) {
  let photo = null;

  if (contact.photos) {
    photo = contact.photos[0].value;
  }

  return Immutable.fromJS({
    id: contact.id,
    name: contact.displayName,
    photo: photo,
  });
}

class MemberAdd extends React.Component {
  static propTypes = {
    onAddMember: React.PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      expend: false,
      dataSource: [],
    };

    this.handleFind = throttle((searchText) => {
      MemberPlugin.find(searchText).then((contacts) => {
        const dataSource = [this.state.dataSource[0]];

        contacts.every((contact, index) => {
          if (!contact.displayName) {
            return true; // Keep going
          }

          const member = getMemberContact(contact);

          dataSource.push({
            text: `${contact.displayName}${index}`, // Need to be unique
            member: member,
            value: (
              <MenuItem
                innerDivStyle={styles.menuItem}
                primaryText={
                  <span style={styles.menuItemText}>
                    {contact.displayName}
                  </span>
                }
                leftAvatar={
                  <MemberAvatar member={member} />
                }
              />
            ),
          });

          return dataSource.length < 5;
        });

        this.setState({
          dataSource: dataSource,
        });
      });
    }, 200);
  }

  handleTouchTapAdd = () => {
    if (process.env.PLATFORM === 'android') {
      MemberPlugin.pickContact().then((contact) => {
        this.props.onAddMember(getMemberContact(contact));
      });
    } else {
      // That's not ready yet for android.
      this.setState({
        expend: true,
      }, () => {
        const searchTextField = this.refs.autoComplete.refs.searchTextField;
        searchTextField.focus();
      });
    }
  };

  handleUpdateInput = (value) => {
    const dataSource = [];

    if (value !== '') {
      const member = getMemberSearchText(value);

      dataSource[0] = {
        text: value,
        member: member,
        value: (
          <MenuItem
            innerDivStyle={styles.menuItem}
            primaryText={<span style={styles.menuItemText}>{value}</span>}
            leftAvatar={<MemberAvatar member={member} />}
          />
        ),
      };
    }

    this.setState({
      dataSource: dataSource,
    }, () => {
      if (value !== '') {
        this.handleFind(value);
      }
    });
  };

  handleBlur = () => {
    if (this.state.dataSource.length === 0) {
      this.setState({
        expend: false,
      });
    }
  };

  handleNewRequest = (value, index) => {
    let member;

    if (index !== -1) {
      member = this.state.dataSource[index].member;
    } else {
      member = getMemberSearchText(value);
    }

    setTimeout(() => {
      this.setState({
        expend: false,
        dataSource: [],
      }, () => {
        this.props.onAddMember(member);
      });
    }, 200);
  };

  render() {
    const {
      expend,
    } = this.state;

    if (expend) {
      return (
        <div style={styles.autoComplete}>
          <AutoComplete
            hintText={polyglot.t('member_add_hint')}
            dataSource={this.state.dataSource}
            onUpdateInput={this.handleUpdateInput}
            onNewRequest={this.handleNewRequest}
            onBlur={this.handleBlur}
            fullWidth={true}
            filter={filter}
            ref="autoComplete"
            data-test="MemberAddName"
          />
        </div>
      );
    } else {
      return (
        <ListItem
          leftIcon={<IconAdd />}
          onTouchTap={this.handleTouchTapAdd}
          primaryText={polyglot.t('member_add')}
          data-test="MemberAdd"
        />
      );
    }
  }
}

export default pure(MemberAdd);
