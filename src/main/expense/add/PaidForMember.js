
import React, { PropTypes, Component } from 'react';
import Checkbox from 'material-ui-build/src/Checkbox';
import pure from 'recompose/pure';
import ImmutablePropTypes from 'react-immutable-proptypes';
import locale from 'locale';
import polyglot from 'polyglot';
import List from 'modules/components/List';
import MemberAvatar from 'main/member/Avatar';
import AmountField from 'modules/components/AmountField';
import accountUtils from 'main/account/utils';

const styles = {
  unequaly: {
    width: 60,
  },
  shares: {
    width: 40,
  },
};

class ExpensePaidForMember extends Component {
  static propTypes = {
    currency: PropTypes.string.isRequired,
    member: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    paidForMember: ImmutablePropTypes.map.isRequired,
    paidForMemberIndex: PropTypes.number.isRequired,
    split: PropTypes.oneOf([
      'equaly',
      'unequaly',
      'shares',
    ]).isRequired,
  };

  state = {};

  componentWillMount() {
    this.setState({
      checked: this.props.paidForMember.get('split_equaly'),
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      checked: nextProps.paidForMember.get('split_equaly'),
    });
  }

  handleTouchTapEqualy = () => {
    this.props.onChange('equaly', !this.state.checked, this.props.paidForMemberIndex);
  };

  handleChangeUnequaly = (amount) => {
    this.props.onChange('unequaly', amount, this.props.paidForMemberIndex);
  };

  handleChangeShares = (amount) => {
    this.props.onChange('shares', amount, this.props.paidForMemberIndex);
  };

  render() {
    const {
      member,
      split,
      currency,
      paidForMember,
    } = this.props;

    let right;
    let handleTouchTap;

    switch (split) {
      case 'equaly':
        handleTouchTap = this.handleTouchTapEqualy;
        right = (
          <Checkbox
            label=""
            name="paidFor"
            value={member.get('id')}
            checked={this.state.checked}
          />
        );
        break;

      case 'unequaly':
        right = (
          <div>
            <AmountField
              value={paidForMember.get('split_unequaly')}
              style={styles.unequaly}
              onChange={this.handleChangeUnequaly}
            />
            {locale.currencyToString(currency)}
          </div>
        );
        break;

      case 'shares':
        right = (
          <div>
            <AmountField
              value={paidForMember.get('split_shares')}
              style={styles.shares}
              isInteger
              onChange={this.handleChangeShares}
            />
            {polyglot.t('shares')}
          </div>
        );
        break;

      default:
        break;
    }

    return (
      <List
        right={right}
        onTouchTap={handleTouchTap}
        left={<MemberAvatar member={member} />}
        withoutMargin
      >
        {accountUtils.getNameMember(member)}
      </List>
    );
  }
}

export default pure(ExpensePaidForMember);
