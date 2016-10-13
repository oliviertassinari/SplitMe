// @flow weak

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
        desiredFields: [
          'id',
          'displayName',
          'name',
          'photos',
        ],
      };

      window.navigator.contacts.find([
        'name',
        'displayName',
      ], resolve, reject, options);
    });
  },
  pickContact() {
    return new Promise((resolve, reject) => {
      window.navigator.contacts.pickContact(resolve, (error) => {
        const ignoreCodes = [
          window.ContactError.PERMISSION_DENIED_ERROR,
          window.ContactError.OPERATION_CANCELLED_ERROR,
        ];

        if (ignoreCodes.indexOf(error) !== -1) {
          return;
        }

        reject(error);
      });
    });
  },
};

export default contacts;
