import {Router as routerCreator} from 'express';
// import FB from 'fb';
import nano from 'nano';
import moment from 'moment';
import Lie from 'lie';

import config from 'config';

let cookie;
let couchDB = nano({
  url: config.couchUrl,
});

function getResponseError(body, context) {
  return {
    status: 'error',
    body: body,
    context: context,
  };
}

function getResponeSuccess(body) {
  return {
    status: 'success',
    body: body,
  };
}

function sanetizeCouchDBName(string) {
  let output = '';

  for (let i = 0; i < string.length; i++) {
    let char = string[i];

    if (/^[0-9-a-z}]/.test(char) === false) {
      char = '/';
    }

    output += char;
  }

  return output;
}

function setUserWithRoles(email, roles, facebook) {
  return new Lie((resolve, reject) => {
    const couchUserId = `org.couchdb.user:${email}`;

    couchDB.use('_users').get(couchUserId, (error, body) => {
      if (error) {
        if (error.error === 'not_found') {
          couchDB.use('_users').insert({
            _id: couchUserId,
            name: email,
            password: `_${email}`,
            facebookName: facebook ? facebook.name : null,
            facebookId: facebook ? facebook.id : null,
            type: 'user',
            roles: roles,
          }, (error2) => {
            if (error2) {
              reject(error2);
              return;
            }

            resolve('SIGNIN');
          });
        } else {
          reject(error);
        }
      } else {
        body.roles = body.roles.concat(roles);

        couchDB.use('_users').insert(body, (error2) => {
          if (error2) {
            reject(error2);
            return;
          }

          resolve('ALREADY_SIGNIN');
        });
      }
    });
  });
}

couchDB.auth(config.couchUsername, config.couchPassword, (error, body, headers) => {
  if (error) {
    console.log(error);
    return;
  }

  // change the cookie if couchDB tells us to
  if (headers && headers['set-cookie']) {
    cookie = headers['set-cookie'];
  }

  couchDB = nano({
    url: config.couchUrl,
    cookie: cookie,
  });

  console.log(`Connected to couchDB : ${config.couchUrl} ✅`);
});

const apiRouter = routerCreator();

// a middleware with no mount path; gets executed for every request to the app
apiRouter.use((req, res, next) => {
  // FB.setAccessToken(req.query.accessToken);
  // FB.api('me', {
  //   fields: [
  //     'id',
  //     'name',
  //     'email',
  //   ],
  // }, (response) => {
  //   if (response.error) {
  //     return res.send(getResponseError(response.error, 'facebook'));
  //   }

  //   req.facebook = response;
  //   next();
  // });

  req.facebook = {
    id: 1339274745,
    name: 'Olivier Tassinari',
    email: 'olivier.tassinari@gmail.com',
  };
  next();
});

apiRouter.get('/signin', (req, res) => {
  setUserWithRoles(req.facebook.email, [], req.facebook)
    .then((response) => {
      res.send(getResponeSuccess(response));
    }).catch((error) => {
      res.send(getResponseError(error, 'couchDB'));
    });
});

apiRouter.get('/account/create', (req, res) => {
  const databaseName = `account_${
    sanetizeCouchDBName(req.facebook.email)}_1_${
    moment().valueOf().toString()}`;

  couchDB.db.create(databaseName, (error) => {
    if (error) {
      res.send(getResponseError(error, 'couchDB'));
      return;
    }

    couchDB.use(databaseName).insert({
      members: {
        names: [],
        roles: [databaseName],
      },
      admins: {
        names: [],
        roles: [],
      },
    }, '_security', (error2) => {
      if (error2) {
        res.send(getResponseError(error2, 'couchDB'));
        return;
      }

      setUserWithRoles(req.facebook.email, [databaseName], req.facebook)
        .then(() => {
          res.send(getResponeSuccess({
            accountDatabaseName: databaseName,
          }));
        }).catch((error3) => {
          res.send(getResponseError(error3, 'couchDB'));
        });
    });
  });
});

apiRouter.get('/account/set_right', (req, res) => {
  const members = JSON.parse(req.query.members);
  const accountDatabaseName = req.query.accountDatabaseName;

  couchDB.use('_users').get(`org.couchdb.user:${req.facebook.email}`, (error, body) => {
    if (error) {
      res.send(getResponseError(error, 'couchDB'));
      return;
    }

    if (body.roles.indexOf(accountDatabaseName) === -1) {
      res.send(getResponseError('You are not allowed to edit this account', 'auth'));
      return;
    }

    const promises = [];

    members.forEach((member) => {
      promises.push(setUserWithRoles(member, [accountDatabaseName], null));
    });

    Lie.all(promises)
      .then((response) => {
        res.send(getResponeSuccess(response));
      }).catch((error2) => {
        res.send(getResponseError(error2, 'couchDB'));
      });
  });
});

apiRouter.get('*', (req, res) => {
  res.send(getResponseError());
});

export default apiRouter;
