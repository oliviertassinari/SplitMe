'use strict';

const Lie = require('lie');

const contacts = {
  pickContact() {
    return new Lie((resolve, reject) => {
      return navigator.contacts.pickContact((contact) => {
        resolve(contact);
      }, (error) => {
        console.warn(error);
        reject(error);
      });
    });
  },
};

module.exports = contacts;
