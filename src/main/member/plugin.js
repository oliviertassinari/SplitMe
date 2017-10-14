
const contacts = {
  find(name) {
    return new Promise((resolve) => {
      if (process.env.NODE_ENV !== 'production') {
        let contactsNew = new Array(20).join('|').split('|');
        contactsNew = contactsNew.map((contact, index) => {
          if (index % 2) {
            return {
              name: {
                formatted: null,
              },
            };
          }

          return {
            name: {
              formatted: `${name}${index}`,
            },
            photos: [{
              value: 'https://avatars1.githubusercontent.com/u/3165635?s=140',
            }],
          };
        });

        resolve(contactsNew);
      } else {
        resolve([]);
      }
    });
  },
};

export default contacts;
