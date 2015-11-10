import actionTypes from 'redux/actionTypes';
import API from 'API';
import accountActions from 'Main/Account/actions';

const actions = {
  tapImport() {
    return {
      type: actionTypes.COUCHDB_TAP_IMPORT,
    };
  },
  tapImportStart(string) {
    return function(dispatch) {
      dispatch({
        type: actionTypes.COUCHDB_TAP_IMPORT_START,
      });
      dispatch({
        type: actionTypes.COUCHDB_TAP_IMPORTED,
        payload: API.import(string),
      }).then(() => {
        dispatch(accountActions.showList());
      });
    };
  },
  tapExport() {
    return function(dispatch) {
      dispatch({
        type: actionTypes.COUCHDB_TAP_EXPORT,
      });
      dispatch({
        type: actionTypes.COUCHDB_TAP_EXPORTED,
        payload: API.export(),
      });
    };
  },
  fetchUser() {
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
      type: actionTypes.COUCHDB_FETCH_USER,
    };
  },
};

export default actions;
