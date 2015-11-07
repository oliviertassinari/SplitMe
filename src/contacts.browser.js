'use strict';

const Lie = require('lie');
const moment = require('moment');

const contacts = {
  pickContact() {
    return new Lie((resolve) => {
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
    });
  },
};

module.exports = contacts;
