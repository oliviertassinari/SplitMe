'use strict';

var React = require('react');
var Paper = require('material-ui/lib/paper');

var polyglot = require('polyglot');
var utils = require('utils');
var locale = require('locale');
var List = require('Main/List');
var ListSubheader = require('Main/ListSubheader');
var Avatar = require('Main/Avatar');
var AccountBalanceChart = require('./BalanceChart');

var styles = {
  paper: {
    display: 'flex',
  },
  left: {
    width: '50%',
  },
  right: {
    width: '50%',
    padding: '0 5px',
  },
};

var AccountBalance = React.createClass({
  propTypes: {
    members: React.PropTypes.array.isRequired,
  },
  render: function() {
    var members = this.props.members;
    var currencies = utils.getCurrenciesWithMembers(members);

    return <div>
        {currencies.map(function(currency) {
          return <div key={currency}>
            {currencies.length > 1 && <ListSubheader subheader={polyglot.t('in_currency', {
              currency: locale.currencyToString(currency)
            })} />}
            <Paper style={styles.paper}>
              <div style={styles.left}>
                {members.map(function(member) {
                  var avatar = <Avatar contact={member} />;

                  return <List key={member.id} left={avatar}>
                    {utils.getDisplayName(member)}
                  </List>;
                })}
              </div>
              <AccountBalanceChart style={styles.right} members={members} currency={currency} />
            </Paper>
          </div>;
        })}
      </div>;
  },
});

module.exports = AccountBalance;
