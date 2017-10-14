/**
 * Cross platform abstraction layer. Using cordova here.
 * https://github.com/apache/cordova-plugin-contacts
 */
const contacts = {
  find(name) {
    return new Promise((resolve, reject) => {
      const options = {
        filter: name,
        multiple: true,
        desiredFields: ['id', 'displayName', 'name', 'photos'],
      };

      window.navigator.contacts.find(['name', 'displayName'], resolve, reject, options);
    });
  },
};

export default contacts;
