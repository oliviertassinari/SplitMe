'use strict';

const Lie = require('lie');
const moment = require('moment');

const config = require('config');

const contacts = {
  pickContact: function() {
    return new Lie(function(resolve, reject) {
      if (config.platform === 'android') {
        return navigator.contacts.pickContact(function(contact) {
          resolve(contact);
        }, function(error) {
          console.warn(error);
          reject(error);
        });
      } else {
        let photos = null;

        if (Math.round(Math.random()) === 1) {
          photos = [{
            value: 'https://avatars1.githubusercontent.com/u/3165635?v=3&s=140',
          }];
        }

        const contact = {
          id: moment().valueOf().toString(),
          displayName: 'Alexandre Dupont',
          photos: photos,
        };

        resolve(contact);
      }
    });
  },
};

module.exports = contacts;
