const contacts = {
  find(name) {
    return new Promise((resolve, reject) => {
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
  pickContact() {
    return new Promise((resolve, reject) => {
      return navigator.contacts.pickContact((contact) => {
        resolve(contact);
      }, (error) => {
        console.warn(error);
        reject(error);
      });
    });
  },
};

export default contacts;
