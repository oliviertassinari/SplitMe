// @flow weak

import React, {PropTypes, Component} from 'react';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {createStyleSheet} from 'stylishly/lib/styleSheet';
import Dialog from 'material-ui-build/src/Dialog';
import RadioButton from 'material-ui-build/src/RadioButton/RadioButton';
import {black} from 'material-ui-build/src/styles/colors';
import polyglot from 'polyglot';
import List from 'modules/components/List';
import MemberAvatar from 'main/member/Avatar';
import MemberAdd from 'main/member/Add';
import accountUtils from 'main/account/utils';

const styleSheet = createStyleSheet('ExpensePaidByDialog', () => ({
  list: {
    maxHeight: 350,
    overflow: 'auto',
  },
}));

const styles = {
  body: {
    padding: '0 0 5px',
    color: black,
  },
};

class ExpensePaidByDialog extends Component {
  static propTypes = {
    members: ImmutablePropTypes.list.isRequired,
    onAddMember: PropTypes.func,
    onChange: PropTypes.func,
    selected: PropTypes.string,
  };

  static contextTypes = {
    styleManager: PropTypes.object.isRequired,
  };

  state = {};

  componentWillMount() {
    this.setState({
      selected: this.props.selected || '',
    });
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
    const classes = this.context.styleManager.render(styleSheet);
    const {
      onAddMember,
      members,
      ...other,
    } = this.props;

    return (
      <Dialog
        {...other}
        title={polyglot.t('paid_by')}
        contentClassName="testExpenseAddPaidByDialog"
        bodyStyle={styles.body}
      >
        <div className={classes.list}>
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
