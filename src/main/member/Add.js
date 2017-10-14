import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { withStyles } from 'material-ui-next/styles';
import throttle from 'lodash.throttle';
import IconAdd from 'material-ui/svg-icons/content/add';
import ListItem from 'material-ui/List/ListItem';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Immutable from 'immutable';
import Md5 from 'spark-md5';
import polyglot from 'polyglot';
import MemberAvatar from 'main/member/Avatar';
import MemberPlugin from 'main/member/plugin';

const styles = {
  menuItemText: {
    marginLeft: 50,
  },
};

const inlineStyles = {
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
    photo,
  };

  contactProcessed.id = Md5.hash(JSON.stringify(contactProcessed));

  return Immutable.fromJS(contactProcessed);
}

class MemberAdd extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onAddMember: PropTypes.func,
  };

  state = {
    expend: false,
    dataSource: [],
  };

  componentWillMount() {
    this.handleFind = throttle(this.handleFind, 200);
  }

  componentWillUnmount() {
    this.handleFind.cancel();
    clearTimeout(this.timer);
  }

  timer = null;
  autoCompleteNode = null;

  handleFind = searchText => {
    MemberPlugin.find(searchText)
      .then(contacts => {
        const dataSource = [this.state.dataSource[0]];

        // Find 5 good candidates.
        contacts.every((contact, index) => {
          if (!contact.name.formatted) {
            return true; // Keep going
          }

          const member = getMemberFromContact(contact);

          dataSource.push({
            text: `${member.get('name')}${index}`, // Need to be unique
            member,
            value: (
              <MenuItem
                innerDivStyle={inlineStyles.menuItem}
                primaryText={
                  <span className={this.props.classes.menuItemText}>{member.get('name')}</span>
                }
                leftAvatar={<MemberAvatar member={member} />}
              />
            ),
          });

          return dataSource.length < 5;
        });

        this.setState({
          dataSource,
        });
      })
      .catch(error => {
        // Explicitly throw an error for the crashReporter.
        setTimeout(() => {
          throw new Error(`find() error code: ${error}`);
        }, 0);
      });
  };

  handleTouchTapAdd = () => {
    this.setState({
      expend: true,
    });
  };

  handleUpdateInput = (value, dataSourceProvided, params) => {
    if (params.source !== 'change') {
      return;
    }

    const dataSource = [];

    if (value !== '') {
      const member = getMemberSearchText(value);

      dataSource[0] = {
        text: value,
        member,
        value: (
          <MenuItem
            innerDivStyle={inlineStyles.menuItem}
            primaryText={<span className={this.props.classes.menuItemText}>{value}</span>}
            leftAvatar={<MemberAvatar member={member} />}
          />
        ),
      };
    }

    this.setState(
      {
        dataSource,
      },
      () => {
        if (value !== '') {
          this.handleFind(value);
        }
      },
    );
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

    this.timer = setTimeout(() => {
      this.setState(
        {
          expend: false,
          dataSource: [],
        },
        () => {
          this.props.onAddMember(member);
        },
      );
    }, 200);
  };

  render() {
    if (this.state.expend) {
      return (
        <div style={inlineStyles.autoComplete}>
          <AutoComplete
            hintText={polyglot.t('member_add_hint')}
            dataSource={this.state.dataSource}
            onUpdateInput={this.handleUpdateInput}
            onNewRequest={this.handleNewRequest}
            onBlur={this.handleBlur}
            fullWidth
            filter={filter}
            autoFocus
            data-test="MemberAddName"
          />
        </div>
      );
    }

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

export default compose(pure, withStyles(styles))(MemberAdd);
