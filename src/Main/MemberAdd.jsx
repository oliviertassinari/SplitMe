import React from 'react';
import IconAdd from 'material-ui/src/svg-icons/content/add';
import ListItem from 'material-ui/src/lists/list-item';
import AutoComplete from 'material-ui/src/auto-complete';
import pure from 'recompose/pure';

import polyglot from 'polyglot';
// import pluginContacts from 'plugin/contacts';

const styles = {
  autoComplete: {
    padding: '5px 16px',
  },
};

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
  }

  handleTouchTapAdd = () => {
    this.setState({
      expend: true,
    }, () => {
      this.refs.autoComplete.refs.searchTextField.focus();
    });
  };

  handleUpdateInput = (value) => {
    this.setState({
      dataSource: [value],
    });

    // pluginContacts.pickContact()
    //   .then(this.props.onAddMember);
  };

  handleNewRequest = (value) => {
    setTimeout(() => {
      this.setState({
        expend: false,
      }, () => {
        this.props.onAddMember({
          id: value,
          displayName: value,
        });
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
            ref="autoComplete"
            hintText={polyglot.t('member_add_hint')}
            dataSource={this.state.dataSource}
            onUpdateInput={this.handleUpdateInput}
            onNewRequest={this.handleNewRequest}
            fullWidth={true}
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
