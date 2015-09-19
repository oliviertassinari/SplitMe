'use strict';

const Lie = require('lie');

const contacts = {
  pickContact: function() {
    return new Lie(function(resolve, reject) {
      return navigator.contacts.pickContact(function(contact) {
        resolve(contact);
      }, function(error) {
        console.warn(error);
        reject(error);
      });
    });
  },
};

module.exports = contacts;
