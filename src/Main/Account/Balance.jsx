'use strict';

var React = require('react');
var _ = require('underscore');
var Paper = require('material-ui/lib/paper');

var utils = require('../../utils');
var List = require('../List');
var Avatar = require('../Avatar');

var AccountBalance = React.createClass({
  propTypes: {
    members: React.PropTypes.array.isRequired,
  },
  render: function() {
    var members = this.props.members;
    var currencies = utils.getCurrenciesWithMembers(members);

    return <Paper>
      {currencies.map(function(currency) {
        return members.map(function(member) {
          var balance = _.findWhere(member.balances, { currency: currency });

          var avatar = <Avatar contact={member} />;

          return <List key={member.id} left={avatar}>
            {utils.getDisplayName(member) + ' ' + balance.value}
          </List>;
        });
      })}
    </Paper>;
  },
});

module.exports = AccountBalance;
