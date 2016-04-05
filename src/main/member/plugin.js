const contacts = {
  find(name) {
    return new Promise((resolve) => {
      if (process.env.NODE_ENV !== 'production') {
        let contactsNew = Array.apply(null, Array(20));
        contactsNew = contactsNew.map((contact, index) => {
          if (index % 2) {
            return {
              id: index,
              displayName: null,
            };
          }

          return {
            id: name,
            displayName: `${name}${index}`,
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
