var Backbone = require('backbone');
var BackbonePouch = require('backbone-pouch');

var database = require('./database');

var ExpenseModel = Backbone.Model.extend({
  idAttribute: '_id',
  defaults: {
    account: '',
    description: '',
    amount: '',
    date: '',
    currency: '',
    by: '',
    share: [],
    shareType: '',
  },
  sync: BackbonePouch.sync({
    db: database
  })
});

module.exports = ExpenseModel;
