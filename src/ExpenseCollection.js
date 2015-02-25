var _ = require('underscore');
var Backbone = require('backbone');
var BackbonePouch = require('backbone-pouch');

var database = require('./database');
var ExpenseModel = require('./ExpenseModel');

var ExpenseCollection = Backbone.Collection.extend({
  model: ExpenseModel,
  sync: BackbonePouch.sync({
    db: database,
    fetch: 'query',
    options: {
      query: {
        include_docs: true,
        descending: true,
        fun: {
          map: function(doc, emit) {
            emit(doc.date);
          }
        }
      },
    }
  }),
  parse: function(result) {
    return _.pluck(result.rows, 'doc');
  }
});

module.exports = ExpenseCollection;
