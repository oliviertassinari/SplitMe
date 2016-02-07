import React from 'react';
import Checkbox from 'material-ui/src/checkbox';
import pure from 'recompose/pure';
import Immutable from 'immutable';

import locale from 'locale';
import polyglot from 'polyglot';
import List from 'Main/List';
import MemberAvatar from 'Main/MemberAvatar';
import AmountField from 'Main/AmountField';
import accountUtils from 'Main/Account/utils';

const styles = {
  unequaly: {
    width: 60,
  },
  shares: {
    width: 40,
  },
};

class ExpensePaidForMember extends React.Component {
  static propTypes = {
    currency: React.PropTypes.string.isRequired,
    member: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    onChange: React.PropTypes.func.isRequired,
    paidFor: React.PropTypes.instanceOf(Immutable.List).isRequired,
    split: React.PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    const paidFor = this.getPaidForById()[1];

    this.state = {
      checked: paidFor.get('split_equaly'),
    };
  }

  handleTouchTapEqualy = () => {
    this.setState({
      checked: !this.state.checked,
    }, () => {
      this.handleCheckEqualy(this.state.checked);
    });
  };

  getPaidForById = () => {
    const id = this.props.member.get('id');

    return this.props.paidFor.findEntry((item) => {
      return item.get('contactId') === id;
    });
  };

  handleCheckEqualy = (checked) => {
    const paidForIndex = this.getPaidForById()[0];
    const paidFor = this.props.paidFor.setIn([paidForIndex, 'split_equaly'], checked);

    this.props.onChange(paidFor);
  };

  handleChangeUnEqualy = (amount) => {
    const paidForIndex = this.getPaidForById()[0];
    const paidFor = this.props.paidFor.setIn([paidForIndex, 'split_unequaly'], amount);

    this.props.onChange(paidFor);
  };

  handleChangeShares = (amount) => {
    const paidForIndex = this.getPaidForById()[0];
    const paidFor = this.props.paidFor.setIn([paidForIndex, 'split_shares'], amount);

    this.props.onChange(paidFor);
  };

  render() {
    const {
      member,
      split,
      currency,
    } = this.props;

    let right;
    let handleTouchTap;

    const paidFor = this.getPaidForById(member.get('id'))[1];

    switch (split) {
      case 'equaly':
        handleTouchTap = this.handleTouchTapEqualy;
        right = (
          <Checkbox
            label="" name="paidFor" value={member.get('id')}
            checked={this.state.checked}
          />
        );
        break;

      case 'unequaly':
        right = (
          <div>
            <AmountField
              value={paidFor.get('split_unequaly')} style={styles.unequaly}
              onChange={this.handleChangeUnEqualy}
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
              onChange={this.handleChangeShares}
            />
            {polyglot.t('shares')}
          </div>
        );
        break;
    }

    return (
      <List
        right={right}
        onTouchTap={handleTouchTap}
        left={<MemberAvatar member={member} />}
        withoutMargin={true}
      >
        {accountUtils.getNameMember(member)}
      </List>
    );
  }
}

export default pure(ExpensePaidForMember);
