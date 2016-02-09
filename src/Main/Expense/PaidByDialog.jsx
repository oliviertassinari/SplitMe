import React from 'react';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import Dialog from 'material-ui/src/dialog';
import RadioButton from 'material-ui/src/radio-button';

import polyglot from 'polyglot';
import List from 'Main/List';
import MemberAvatar from 'Main/Member/Avatar';
import MemberAdd from 'Main/Member/Add';
import accountUtils from 'Main/Account/utils';

const styles = {
  body: {
    padding: '16px 0 5px 0',
  },
  list: {
    maxHeight: 350,
    overflow: 'auto',
  },
};

class ExpensePaidByDialog extends React.Component {
  static propTypes = {
    members: React.PropTypes.instanceOf(Immutable.List).isRequired,
    onAddMember: React.PropTypes.func,
    onChange: React.PropTypes.func,
    selected: React.PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: props.selected || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty('selected')) {
      this.setState({
        selected: nextProps.selected,
      });
    }
  }

  onTouchTap = (newSelectedMember) => {
    this.setState({
      selected: newSelectedMember.get('id'),
    });

    this.props.onChange(newSelectedMember);
  };

  render() {
    const {
      onAddMember,
      members,
      ...other,
    } = this.props;

    return (
      <Dialog
        {...other} title={polyglot.t('paid_by')}
        contentClassName="testExpenseAddPaidByDialog" bodyStyle={styles.body}
      >
        <div style={styles.list}>
          {members.map((member) => {
            return (
              <List
                onTouchTap={this.onTouchTap.bind(this, member)}
                left={<MemberAvatar member={member} />}
                key={member.get('id')}
                right={
                  <RadioButton
                    value={member.get('id')}
                    checked={member.get('id') === this.state.selected}
                  />
                }
              >
                {accountUtils.getNameMember(member)}
              </List>
            );
          })}
        </div>
        <MemberAdd onAddMember={onAddMember} />
      </Dialog>
    );
  }
}

export default pure(ExpensePaidByDialog);
