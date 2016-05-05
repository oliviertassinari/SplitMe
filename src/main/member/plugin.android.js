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
        reject(error);
        throw new Error(error);
      }, options);
    });
  },
  pickContact() {
    return new Promise((resolve, reject) => {
      return navigator.contacts.pickContact((contact) => {
        resolve(contact);
      }, (error) => {
        reject(error);
        throw new Error(error);
      });
    });
  },
};

export default contacts;
