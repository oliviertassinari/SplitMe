var Backbone = require('backbone');
var BackbonePouch = require('backbone-pouch');

var database = require('./database');

var AccountModel = Backbone.Model.extend({
  idAttribute: '_id',
  defaults: {
    name: '',
    lastExpense: '',
    members: [],
    expenses: [],
    balance: [],
  },
  sync: BackbonePouch.sync({
    db: database
  })
});

module.exports = AccountModel;