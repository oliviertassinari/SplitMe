// @flow weak

import React, {PropTypes, Component} from 'react';
import IconAdd from 'material-ui-build/src/svg-icons/content/add';
import ListItem from 'material-ui-build/src/List/ListItem';
import AutoComplete from 'material-ui-build/src/AutoComplete';
import pure from 'recompose/pure';
import {createStyleSheet} from 'stylishly/lib/styleSheet';
import throttle from 'lodash.throttle';
import MenuItem from 'material-ui-build/src/MenuItem';
import MemberAvatar from 'main/member/Avatar';
import Immutable from 'immutable';
import Md5 from 'spark-md5';
import polyglot from 'polyglot';
import MemberPlugin from 'main/member/plugin';

const styleSheet = createStyleSheet('MemberAdd', () => ({
  menuItemText: {
    marginLeft: 50,
  },
}));

const styles = {
  autoComplete: {
    padding: '0 16px',
  },
  menuItem: {
    paddingTop: 4,
    paddingBottom: 3,
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

export function getMemberFromContact(contact) {
  let photo = null;

  if (contact.photos) {
    photo = contact.photos[0].value;
  }

  const contactProcessed = {
    id: '',
    name: contact.name.formatted,
    photo: photo,
  };

  contactProcessed.id = Md5.hash(JSON.stringify(contactProcessed));

  return Immutable.fromJS(contactProcessed);
}

class MemberAdd extends Component {
  static propTypes = {
    onAddMember: PropTypes.func,
  };

  static contextTypes = {
    styleManager: PropTypes.object.isRequired,
  };

  state = {
    expend: false,
    dataSource: [],
  };

  componentWillMount() {
    this.handleFind = throttle(this.handleFind, 200);
  }

  classes = {};

  handleFind = (searchText) => {
    MemberPlugin.find(searchText).then((contacts) => {
      const dataSource = [this.state.dataSource[0]];

      contacts.every((contact, index) => {
        if (!contact.name.formatted) {
          return true; // Keep going
        }

        const member = getMemberFromContact(contact);

        dataSource.push({
          text: `${member.get('name')}${index}`, // Need to be unique
          member: member,
          value: (
            <MenuItem
              innerDivStyle={styles.menuItem}
              primaryText={
                <span className={this.classes.menuItemText}>
                  {member.get('name')}
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
  };

  handleTouchTapAdd = () => {
    if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
      MemberPlugin.pickContact().then((contact) => {
        this.props.onAddMember(getMemberFromContact(contact));
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
            primaryText={<span className={this.classes.menuItemText}>{value}</span>}
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
    this.classes = this.context.styleManager.render(styleSheet);

    if (this.state.expend) {
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
