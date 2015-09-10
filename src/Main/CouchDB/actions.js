'use strict';

const API = require('API');
const accountActions = require('Main/Account/actions');

const actions = {
  tapImport: function() {
    return {
      type: 'COUCHDB_TAP_IMPORT',
    };
  },
  tapImportStart: function(string) {
    return function(dispatch) {
      dispatch({
        type: 'COUCHDB_TAP_IMPORT_START',
      });
      dispatch({
        type: 'COUCHDB_TAP_IMPORTED',
        payload: API.import(string),
      }).then(function() {
        dispatch(accountActions.fetchAll());
      });
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
    // let couchUrl = 'http://localhost:5984';
    // let serverUrl = 'http://localhost:3000';
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
