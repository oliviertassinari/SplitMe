var _ = require('underscore');
var Backbone = require('backbone');
var BackbonePouch = require('backbone-pouch');

var database = require('./database');
var AccountModel = require('./AccountModel');

var AccountCollection = Backbone.Collection.extend({
  model: AccountModel,
  sync: BackbonePouch.sync({
    db: database,
    fetch: 'query',
    options: {
      query: {
        include_docs: true,
        descending: true,
        fun: {
          map: function(doc, emit) {
            emit(doc.lastExpense);
          }
        }
      },
    }
  }),
  parse: function(result) {
    return _.pluck(result.rows, 'doc');
  }
});

module.exports = AccountCollection;