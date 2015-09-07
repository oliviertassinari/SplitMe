'use strict';

var Lie = require('lie');
var moment = require('moment');

var config = require('config');

var contacts = {
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
        var photos = null;

        if (Math.round(Math.random()) === 1) {
          photos = [{
            value: 'https://avatars1.githubusercontent.com/u/3165635?v=3&s=140',
          }];
        }

        var contact = {
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
