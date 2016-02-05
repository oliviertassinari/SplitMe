import React from 'react';
import ReactDOM from 'react-dom';
import pure from 'recompose/pure';
import Immutable from 'immutable';
import Checkbox from 'material-ui/src/checkbox';
import IconAdd from 'material-ui/src/svg-icons/content/add';
import ListItem from 'material-ui/src/lists/list-item';

import accountUtils from 'Main/Account/utils';
import polyglot from 'polyglot';
import locale from 'locale';
import List from 'Main/List';
import MemberAvatar from 'Main/MemberAvatar';
import AmountField from 'Main/AmountField';

const styles = {
  unequaly: {
    width: 60,
  },
  shares: {
    width: 40,
  },
};

class PaidFor extends React.Component {
  static propTypes = {
    currency: React.PropTypes.string.isRequired,
    members: React.PropTypes.instanceOf(Immutable.List).isRequired,
    onChange: React.PropTypes.func.isRequired,
    onPickContact: React.PropTypes.func.isRequired,
    paidFor: React.PropTypes.instanceOf(Immutable.List).isRequired,
    split: React.PropTypes.string.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.handleTouchTapAdd = this.handleTouchTapAdd.bind(this);
    this.onChangeShares = this.onChangeShares.bind(this);
    this.onChangeUnEqualy = this.onChangeUnEqualy.bind(this);
    this.onCheckEqualy = this.onCheckEqualy.bind(this);
    this.onTouchTapEqualy = this.onTouchTapEqualy.bind(this);
  }

  handleTouchTapAdd() {
    this.props.onPickContact();
  }

  getPaidForById(id) {
    return this.props.paidFor.findEntry((item) => {
      return item.get('contactId') === id;
    });
  }

  onTouchTapEqualy(ref, event) {
    const input = ReactDOM.findDOMNode(this.refs[ref]).querySelector('input');

    if (input !== event.target) {
      input.click();
    }
  }

  onCheckEqualy(id, event, checked) {
    const paidForIndex = this.getPaidForById(id)[0];
    const paidFor = this.props.paidFor.setIn([paidForIndex, 'split_equaly'], checked);

    this.props.onChange(paidFor);
  }

  onChangeUnEqualy(id, amount) {
    const paidForIndex = this.getPaidForById(id)[0];
    const paidFor = this.props.paidFor.setIn([paidForIndex, 'split_unequaly'], amount);

    this.props.onChange(paidFor);
  }

  onChangeShares(id, amount) {
    const paidForIndex = this.getPaidForById(id)[0];
    const paidFor = this.props.paidFor.setIn([paidForIndex, 'split_shares'], amount);

    this.props.onChange(paidFor);
  }

  render() {
    const {
      members,
      currency,
      split,
    } = this.props;

    return (
      <div data-test="ExpenseAddPaidFor">
        {polyglot.t('paid_for')}
        {members.map((member) => {
          let right;
          let onTouchTap;

          const paidFor = this.getPaidForById(member.get('id'))[1];

          switch (split) {
            case 'equaly':
              right = (
                <Checkbox
                  label="" name="paidFor" ref={member.get('id') + '_checkbox'}
                  value={member.get('id')}
                  defaultChecked={paidFor.get('split_equaly')}
                  onCheck={this.onCheckEqualy.bind(this, member.get('id'))}
                />
              );
              onTouchTap = this.onTouchTapEqualy.bind(this, member.get('id') + '_checkbox');
              break;

            case 'unequaly':
              right = (
                <div>
                  <AmountField
                    value={paidFor.get('split_unequaly')} style={styles.unequaly}
                    onChange={this.onChangeUnEqualy.bind(this, member.get('id'))}
                  />
                  {locale.currencyToString(currency)}
                </div>
              );
              break;

            case 'shares':
              right = (
                <div>
                  <AmountField
                    value={paidFor.get('split_shares')} style={styles.shares} isInteger={true}
                    onChange={this.onChangeShares.bind(this, member.get('id'))}
                  />
                  {polyglot.t('shares')}
                </div>
              );
              break;
          }

          const avatar = <MemberAvatar member={member} />;

          return (
            <List
              onTouchTap={onTouchTap} right={right} left={avatar}
              key={member.get('id')}
              withoutMargin={true}
            >
              {accountUtils.getNameMember(member)}
            </List>
          );
        })}
        <ListItem
          leftIcon={<IconAdd />} onTouchTap={this.handleTouchTapAdd} withoutMargin={true}
          primaryText={polyglot.t('add_a_new_person')} data-test="ListItem"
        />
      </div>
    );
  }
}

export default pure(PaidFor);
