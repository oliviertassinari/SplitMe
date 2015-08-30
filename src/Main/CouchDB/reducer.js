'use strict';

var Immutable = require('immutable');

function reducer(state, action) {
  if (state === undefined) {
    state = new Immutable.Map();
  }

  switch (action.type) {
    case '':
      return state;

    default:
      return state;
  }
}

module.exports = reducer;

// 'use strict';

// var actions = {
//   fetchUser: function() {
//     // TODO
//     // var couchUrl = 'http://localhost:5984';
//     // var serverUrl = 'http://localhost:3000';
//     // auth : NEED npm pouchdbAuth
//     // check user
//     // if fail
//     // call /signin NEED npm request

//     // remoteDB1.replicate.to(localDB);
//     // remoteDB2.replicate.to(localDB);
//     // remoteDB3.replicate.to(localDB);

//     // localDB.replicate.to(remoteDB1, {
//     //   filter: function (doc) {
//     //     return doc.share || indexOf;
//     //   }
//     // });
//     //
//     // Handle conflicts
//     return {
//       type: 'COUCHDB_FETCH_USER',
//     };
//   },
// };

// module.exports = actions;
