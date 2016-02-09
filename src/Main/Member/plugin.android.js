import Lie from 'lie';

const contacts = {
  find(name) {
    return new Lie((resolve, reject) => {
      const options = {
        filter: name,
        multiple: true,
        desiredFields: [
          'id',
          'displayName',
          'name',
          'photos',
        ],
      };

      navigator.contacts.find([
        'name',
        'displayName',
      ], (contactsFound) => {
        resolve(contactsFound);
      }, (error) => {
        console.warn(error);
        reject(error);
      }, options);
    });
  },
};

export default contacts;
