'use strict';

var Lie = require('lie');
var moment = require('moment');

var contacts = {
  pickContact: function() {
    return new Lie(function(resolve, reject) {
      if (process.env.NODE_ENV === 'production') {
        return navigator.contacts.pickContact(function(contact) {
          console.log(contact);
          resolve(contact);
        }, function(error) {
          console.log(error);
          reject(error);
        });
      } else {
        resolve({
          id: moment().valueOf().toString(),
          displayName: 'Alexandre Dupont',
          photos: [{
            value: 'https://avatars1.githubusercontent.com/u/3165635?v=3&s=140',
          }],
        });
      }
    });
  },
};

module.exports = contacts;
