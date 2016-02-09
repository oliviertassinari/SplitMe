import Lie from 'lie';

const contacts = {
  find(name) {
    return new Lie((resolve) => {
      if (process.env.NODE_ENV !== 'production') {
        resolve([{
          id: name,
          displayName: name,
          photos: [{
            value: 'https://avatars1.githubusercontent.com/u/3165635?v=3&s=140',
          }],
        }]);
      } else {
        resolve([]);
      }
    });
  },
};

export default contacts;
