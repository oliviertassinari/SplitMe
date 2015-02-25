var assert = require('assert');

describe('Account', function() {
  var PouchDB = require('pouchdb');
  var database = new PouchDB('split');

  beforeEach('destroy database', function(done) {
    database.destroy().then(function() {
      done();
    });
  });

  describe('#save()', function() {
    it('should return 1 element when we store', function(done) {
      var AccountModel = require('../src/AccountModel');
      var accountModel = new AccountModel({
        name: 'test1',
      });

      accountModel.save(null, {
        success: function() {
          var AccountCollection = require('../src/AccountCollection');
          var accountCollection = new AccountCollection();

          accountCollection.fetch({
            success: function(collection, response) {
              assert.equal(1, accountCollection.length);
              done();
            }
          });
        },
        error: function() {
          throw arguments;
        }
      });
    });
  });
});