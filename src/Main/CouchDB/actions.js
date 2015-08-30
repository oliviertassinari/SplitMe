'use strict';

var API = require('API');

var actions = {
  tapImport: function() {
    API.import();

    return {
      type: 'COUCHDB_TAP_IMPORT',
    };
  },
  tapExport: function() {
    return function(dispatch) {
      dispatch({
        type: 'COUCHDB_TAP_EXPORT',
      });
      dispatch({
        type: 'COUCHDB_TAP_EXPORTED',
        payload: API.export(),
      });
    };
  },
  fetchUser: function() {
    // TODO
    // var couchUrl = 'http://localhost:5984';
    // var serverUrl = 'http://localhost:3000';
    // auth : NEED npm pouchdbAuth
    // check user
    // if fail
    // call /signin NEED npm request

    // remoteDB1.replicate.to(localDB);
    // remoteDB2.replicate.to(localDB);
    // remoteDB3.replicate.to(localDB);

    // localDB.replicate.to(remoteDB1, {
    //   filter: function (doc) {
    //     return doc.share || indexOf;
    //   }
    // });
    //
    // Handle conflicts
    return {
      type: 'COUCHDB_FETCH_USER',
    };
  },
};

module.exports = actions;
